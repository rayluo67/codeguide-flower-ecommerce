import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories, products } from '@/db/schema/ecommerce';
import { eq, count, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const categoriesList = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        imageUrl: categories.imageUrl,
        slug: categories.slug,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, and(
        eq(products.categoryId, categories.id),
        eq(products.isActive, true)
      ))
      .where(eq(categories.isActive, true))
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt));

    // Add caching headers
    return NextResponse.json(categoriesList, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}