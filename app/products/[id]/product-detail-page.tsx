'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Package, 
  Shield,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ProductResponse } from '@/lib/types/ecommerce';
import Link from 'next/link';

export function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product?.id, 'Quantity:', quantity);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement wishlist functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = product.imageUrl ? [product.imageUrl, ...(product.images || [])] : (product.images || []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-primary">Products</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            {allImages[selectedImage] ? (
              <Image
                src={allImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-8xl mb-4">🌸</div>
                  <div className="text-lg">No Image Available</div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-20 h-20 overflow-hidden rounded border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            {product.category && (
              <Badge variant="outline" className="mb-2">
                {product.category.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0) • 24 reviews</span>
            </div>
            <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'A beautiful flower arrangement perfect for any occasion.'}
            </p>
          </div>

          {/* Product Attributes */}
          {product.flowerType || product.color || product.occasion ? (
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.flowerType && (
                  <div>
                    <span className="font-medium">Flower Type:</span> {product.flowerType}
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="font-medium">Color:</span> {product.color}
                  </div>
                )}
                {product.occasion && (
                  <div>
                    <span className="font-medium">Occasion:</span> {product.occasion}
                  </div>
                )}
                {product.vaseIncluded !== undefined && (
                  <div>
                    <span className="font-medium">Vase Included:</span> {product.vaseIncluded ? 'Yes' : 'No'}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Stock Status */}
          <div>
            {product.stockQuantity > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm">In Stock ({product.stockQuantity} available)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-sm">Out of Stock</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-16 text-center font-medium">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleLike}
                className={isLiked ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-5 w-5 text-primary" />
              <span>Secure Packaging</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Fresh Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Description</h3>
                <div className="prose max-w-none">
                  <p>
                    {product.description || `This beautiful ${product.flowerType || 'flower'} arrangement is perfect for ${product.occasion || 'any occasion'}. 
                    Carefully selected and arranged by our expert florists, this arrangement brings beauty and elegance to any space.`}
                  </p>
                  {product.fragrance && (
                    <p><strong>Fragrance:</strong> {product.fragrance}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="care" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Care Instructions</h3>
                <div className="space-y-3">
                  {product.careInstructions ? (
                    <p>{product.careInstructions}</p>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">1</div>
                        <p>Trim stems at an angle before placing in water</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">2</div>
                        <p>Change water every 2 days</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">3</div>
                        <p>Keep away from direct sunlight and heat</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">4</div>
                        <p>Mist flowers daily for longer freshness</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Free standard shipping on orders over $50</li>
                      <li>• Express shipping available at checkout</li>
                      <li>• Orders delivered within 2-5 business days</li>
                      <li>• Same-day delivery available in select areas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Returns</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 100% satisfaction guarantee</li>
                      <li>• Returns accepted within 7 days of delivery</li>
                      <li>• Product must be in original condition</li>
                      <li>• Contact customer service for return arrangements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}