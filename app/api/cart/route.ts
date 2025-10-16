import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cart, products } from '@/db/schema/ecommerce';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const CartItemSchema = z.object({
  sessionId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

// GET - Fetch cart items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          imageUrl: products.imageUrl,
          sku: products.sku,
          stockQuantity: products.stockQuantity,
          isActive: products.isActive,
        },
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(and(
        eq(cart.sessionId, sessionId),
        eq(products.isActive, true)
      ));

    // Filter out items with inactive or out of stock products
    const validItems = cartItems.filter(item => 
      item.product && item.product.isActive && item.product.stockQuantity > 0
    );

    const total = validItems.reduce((sum, item) => 
      sum + (parseFloat(item.product.price) * item.quantity), 0
    ).toFixed(2);
    
    const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

    const response = {
      items: validItems,
      total,
      itemCount,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, productId, quantity } = CartItemSchema.parse(body);

    // Check if product exists and is available
    const product = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.isActive, true),
        eq(products.stockQuantity, quantity)
      ))
      .limit(1);

    if (!product.length) {
      return NextResponse.json(
        { error: 'Product not available or insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cart)
      .where(and(
        eq(cart.sessionId, sessionId),
        eq(cart.productId, productId)
      ))
      .limit(1);

    if (existingItem.length) {
      // Update existing item
      const newQuantity = existingItem[0].quantity + quantity;
      
      if (newQuantity > product[0].stockQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock available' },
          { status: 400 }
        );
      }

      await db
        .update(cart)
        .set({ 
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cart.id, existingItem[0].id));
    } else {
      // Add new item
      await db.insert(cart).values({
        sessionId,
        productId,
        quantity,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, productId, quantity } = CartItemSchema.parse(body);

    if (quantity === 0) {
      // Remove item if quantity is 0
      await db
        .delete(cart)
        .where(and(
          eq(cart.sessionId, sessionId),
          eq(cart.productId, productId)
        ));
      
      return NextResponse.json({ success: true });
    }

    // Check if product has sufficient stock
    const product = await db
      .select({ stockQuantity: products.stockQuantity })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product.length || quantity > product[0].stockQuantity) {
      return NextResponse.json(
        { error: 'Insufficient stock available' },
        { status: 400 }
      );
    }

    // Update cart item
    const result = await db
      .update(cart)
      .set({ 
        quantity,
        updatedAt: new Date(),
      })
      .where(and(
        eq(cart.sessionId, sessionId),
        eq(cart.productId, productId)
      ))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const productId = searchParams.get('productId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (productId) {
      // Remove specific item
      await db
        .delete(cart)
        .where(and(
          eq(cart.sessionId, sessionId),
          eq(cart.productId, productId)
        ));
    } else {
      // Clear entire cart
      await db
        .delete(cart)
        .where(eq(cart.sessionId, sessionId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}