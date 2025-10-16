'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Menu, Phone, Mail, Star, Truck, Shield } from 'lucide-react';
import { CartIcon } from '@/components/cart-icon';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredCategories = [
    { name: 'Roses', image: '🌹', count: 24, slug: 'roses' },
    { name: 'Tulips', image: '🌷', count: 18, slug: 'tulips' },
    { name: 'Lilies', image: '🌺', count: 15, slug: 'lilies' },
    { name: 'Sunflowers', image: '🌻', count: 12, slug: 'sunflowers' },
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'Classic Red Rose Bouquet',
      price: '49.99',
      image: '🌹',
      rating: 4.8,
      reviews: 124,
      description: 'Beautiful arrangement of premium red roses',
    },
    {
      id: '2',
      name: 'Spring Tulip Mix',
      price: '39.99',
      image: '🌷',
      rating: 4.6,
      reviews: 89,
      description: 'Colorful mix of fresh spring tulips',
    },
    {
      id: '3',
      name: 'Elegant White Lilies',
      price: '54.99',
      image: '🌺',
      rating: 4.9,
      reviews: 156,
      description: 'Sophisticated white lily arrangement',
    },
  ];

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl">🌸</div>
              <span className="text-xl font-bold text-primary">Bloom & Blossom</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Search and Cart */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search flowers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <CartIcon />
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-pink-100 text-pink-800">Fresh Flowers Daily</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Beautiful Flowers for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {' '}Every Occasion
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our stunning collection of fresh, beautiful flowers. 
              From romantic roses to cheerful sunflowers, find the perfect bouquet for your special moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Fresh Guarantee</h3>
              <p className="text-gray-600">100% satisfaction guaranteed</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">24/7 Support</h3>
              <p className="text-gray-600">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect flowers by browsing our curated collections
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                      {category.image}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} products</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Arrangements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked selections of our most popular and beautiful flower arrangements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Brighten Someone's Day?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who trust us for their special moments
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              Shop Now - 10% Off First Order
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🌸</div>
                <span className="text-xl font-bold">Bloom & Blossom</span>
              </div>
              <p className="text-gray-400">
                Your trusted source for fresh, beautiful flowers for every occasion.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white">Shop</Link></li>
                <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>1-800-FLOWERS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@bloomblossom.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bloom & Blossom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
