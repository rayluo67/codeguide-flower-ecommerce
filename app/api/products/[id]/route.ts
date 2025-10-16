import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema/ecommerce';
import { eq, and } from 'drizzle-orm';
import { ProductIdSchema } from '@/lib/validations/ecommerce';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate product ID
    const productId = ProductIdSchema.safeParse(id);
    if (!productId.success) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        images: products.images,
        stockQuantity: products.stockQuantity,
        sku: products.sku,
        featured: products.featured,
        weight: products.weight,
        dimensions: products.dimensions,
        careInstructions: products.careInstructions,
        flowerType: products.flowerType,
        color: products.color,
        fragrance: products.fragrance,
        vaseIncluded: products.vaseIncluded,
        occasion: products.occasion,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.id, productId.data), eq(products.isActive, true)))
      .limit(1);

    if (!product.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add caching headers
    return NextResponse.json(product[0], {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}