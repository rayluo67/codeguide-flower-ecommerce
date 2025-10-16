'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { ProductResponse } from '@/lib/types/ecommerce';

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Add to cart functionality
    console.log('Add to cart:', product.id);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    // TODO: Add to wishlist functionality
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">🌸</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {product.featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Featured
              </Badge>
            )}
            {product.stockQuantity <= 5 && (
              <Badge variant="destructive">
                Low Stock
              </Badge>
            )}
          </div>
          
          {/* Like Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
            onClick={handleToggleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Category */}
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
            )}
            
            {/* Product Name */}
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
            
            {/* Product Attributes */}
            <div className="flex gap-2 text-xs text-gray-500">
              {product.flowerType && (
                <span>{product.flowerType}</span>
              )}
              {product.color && (
                <span>• {product.color}</span>
              )}
              {product.occasion && (
                <span>• {product.occasion}</span>
              )}
            </div>
            
            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}