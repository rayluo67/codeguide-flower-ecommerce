import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products, cart } from '@/db/schema/ecommerce';
import { user } from '@/db/schema/auth';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';
import { OrderSchema } from '@/lib/validations/ecommerce';

const OrderCreationSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
  }),
  paymentMethod: z.enum(['stripe', 'paypal']),
  sessionId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = OrderCreationSchema.parse(body);
    const { items, shippingAddress, paymentMethod, sessionId, userId } = validatedData;

    // Calculate order totals and validate stock
    let subtotal = 0;
    const orderItemsWithPrices = [];

    for (const item of items) {
      const product = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          imageUrl: products.imageUrl,
          stockQuantity: products.stockQuantity,
          isActive: products.isActive,
        })
        .from(products)
        .where(and(
          eq(products.id, item.productId),
          eq(products.isActive, true)
        ))
        .limit(1);

      if (!product.length) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or inactive` },
          { status: 400 }
        );
      }

      const productData = product[0];
      
      if (item.quantity > productData.stockQuantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${productData.name}. Available: ${productData.stockQuantity}` },
          { status: 400 }
        );
      }

      const itemTotal = parseFloat(productData.price) * item.quantity;
      subtotal += itemTotal;

      orderItemsWithPrices.push({
        ...item,
        unitPrice: productData.price,
        totalPrice: itemTotal.toString(),
        productSnapshot: JSON.stringify(productData),
      });
    }

    const taxAmount = subtotal * 0.08; // 8% tax
    const shippingAmount = subtotal > 50 ? 0 : 9.99;
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const newOrder = await db.insert(orders).values({
      userId: userId || null,
      orderNumber,
      status: 'pending',
      totalAmount: totalAmount.toString(),
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      shippingAmount: shippingAmount.toString(),
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod,
      paymentStatus: 'pending',
    }).returning();

    const order = newOrder[0];

    // Create order items
    await db.insert(orderItems).values(
      orderItemsWithPrices.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        productSnapshot: item.productSnapshot,
      }))
    );

    // Update product stock
    for (const item of items) {
      await db
        .update(products)
        .set({ 
          stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }

    // Clear cart items if sessionId is provided
    if (sessionId) {
      await db
        .delete(cart)
        .where(eq(cart.sessionId, sessionId));
    }

    // Return created order with items
    const createdOrder = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        subtotal: orders.subtotal,
        taxAmount: orders.taxAmount,
        shippingAmount: orders.shippingAmount,
        shippingAddress: orders.shippingAddress,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        orderDate: orders.orderDate,
      })
      .from(orders)
      .where(eq(orders.id, order.id))
      .limit(1);

    const orderItemsData = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        totalPrice: orderItems.totalPrice,
        productSnapshot: orderItems.productSnapshot,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const responseOrder = {
      ...createdOrder[0],
      items: orderItemsData,
      shippingAddress: JSON.parse(createdOrder[0].shippingAddress),
    };

    return NextResponse.json(responseOrder, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Get orders for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      );
    }

    const userOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        orderDate: orders.orderDate,
        shippedDate: orders.shippedDate,
        deliveredDate: orders.deliveredDate,
      })
      .from(orders)
      .where(userId ? 
        eq(orders.userId, userId) : 
        eq(orders.sessionId, sessionId)
      )
      .orderBy(orders.orderDate);

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}