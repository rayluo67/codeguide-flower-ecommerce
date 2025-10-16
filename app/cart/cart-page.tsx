'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag,
  ArrowLeft,
  Truck,
  Shield
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartPage() {
  const { state, updateItem, removeItem, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    
    setIsUpdating(productId);
    try {
      await updateItem(productId, newQuantity);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsUpdating(productId);
    try {
      await removeItem(productId);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleClearCart = async () => {
    setIsUpdating('all');
    try {
      await clearCart();
    } finally {
      setIsUpdating(null);
    }
  };

  // Calculate totals
  const subtotal = parseFloat(state.total);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (state.isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/products" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {state.items.length === 0 ? (
        // Empty Cart
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any flowers to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                {item.product.imageUrl ? (
                                  <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <div className="text-2xl">🌸</div>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                                {item.product.stockQuantity <= 5 && (
                                  <Badge variant="destructive" className="mt-1">
                                    Low Stock
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(item.product.price)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                disabled={isUpdating === item.productId || item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0 && value <= 99) {
                                    handleQuantityChange(item.productId, value);
                                  }
                                }}
                                className="w-16 text-center"
                                min="1"
                                max="99"
                                disabled={isUpdating === item.productId}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                disabled={isUpdating === item.productId || item.quantity >= item.product.stockQuantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.productId)}
                              disabled={isUpdating === item.productId}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-4">
                  {state.items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.product.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <div className="text-2xl">🌸</div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  disabled={isUpdating === item.productId || item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  disabled={isUpdating === item.productId || item.quantity >= item.product.stockQuantity}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.productId)}
                                disabled={isUpdating === item.productId}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="p-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={handleClearCart}
                    disabled={isUpdating === 'all'}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal.toFixed(2))}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping.toFixed(2))
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax.toFixed(2))}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total.toFixed(2))}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Add {(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>

                {/* Guarantee */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>100% Fresh Guarantee</span>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>🔒 Secure checkout powered by SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}