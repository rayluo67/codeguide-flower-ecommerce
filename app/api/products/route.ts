import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema/ecommerce';
import { sql, desc, eq, and } from 'drizzle-orm';
import { ProductQuerySchema } from '@/lib/validations/ecommerce';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const query = ProductQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      category: searchParams.get('category'),
      search: searchParams.get('search'),
      featured: searchParams.get('featured'),
    });

    const offset = (query.page - 1) * query.limit;

    // Build query conditions
    const conditions = [eq(products.isActive, true)];
    
    if (query.category) {
      conditions.push(eq(categories.slug, query.category));
    }
    
    if (query.search) {
      conditions.push(
        sql`${products.name} ILIKE ${'%' + query.search + '%'} OR ${products.description} ILIKE ${'%' + query.search + '%'}`
      );
    }
    
    if (query.featured) {
      conditions.push(eq(products.featured, true));
    }

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions));

    const total = totalCountResult[0]?.count || 0;

    // Get products
    const productsList = await db
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
        flowerType: products.flowerType,
        color: products.color,
        occasion: products.occasion,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(products.featured), desc(products.createdAt))
      .limit(query.limit)
      .offset(offset);

    const response = {
      products: productsList,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
        hasNext: offset + query.limit < total,
        hasPrev: query.page > 1,
      },
    };

    // Add caching headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}