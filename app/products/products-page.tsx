'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { ProductResponse, CategoryResponse, ProductsListResponse } from '@/lib/types/ecommerce';

export function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  const [showFilters, setShowFilters] = useState(false);

  const limit = 12;

  const fetchProducts = async (currentPage = 1, reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategory) params.set('category', selectedCategory);
      if (featured) params.set('featured', 'true');

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data: ProductsListResponse = await response.json();
      
      if (reset) {
        setProducts(data.products);
      } else {
        setProducts(prev => currentPage === 1 ? data.products : [...prev, ...data.products]);
      }
      
      setTotal(data.pagination.total);
      setHasNext(data.pagination.hasNext);
      setHasPrev(data.pagination.hasPrev);
      setPage(data.pagination.page);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1, true);
  }, [searchTerm, selectedCategory, featured]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1, true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setFeatured(false);
  };

  const activeFilters = [
    searchTerm && { type: 'search', label: searchTerm },
    selectedCategory && { type: 'category', label: categories.find(c => c.slug === selectedCategory)?.name },
    featured && { type: 'featured', label: 'Featured' },
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Beautiful Flowers</h1>
        <p className="text-gray-600">Discover our collection of fresh, beautiful flowers for every occasion</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for flowers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant={featured ? "default" : "outline"}
                    onClick={() => setFeatured(!featured)}
                    className="w-full"
                  >
                    {featured ? '✓ Featured' : 'Show Featured'}
                  </Button>
                </div>

                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {activeFilters.map((filter: any, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {filter.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      if (filter.type === 'search') setSearchTerm('');
                      else if (filter.type === 'category') setSelectedCategory('');
                      else if (filter.type === 'featured') setFeatured(false);
                    }}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {products.length} of {total} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌻</div>
          <h3 className="text-xl font-semibold mb-2">No flowers found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (hasNext || hasPrev) && (
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            disabled={!hasPrev}
            onClick={() => fetchProducts(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            disabled={!hasNext}
            onClick={() => fetchProducts(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}