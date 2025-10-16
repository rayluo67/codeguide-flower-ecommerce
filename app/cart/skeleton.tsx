import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CartPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {/* Desktop Table Skeleton */}
              <div className="hidden md:block p-6">
                <div className="border-b pb-4 mb-4">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                </div>
                
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 items-center py-4 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-16 h-16 rounded" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-12" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>

              {/* Mobile Card Skeleton */}
              <div className="md:hidden p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Skeleton className="w-20 h-20 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-16 mb-2" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-4 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </div>
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <Skeleton className="h-7 w-32 mb-4" />
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              
              <Skeleton className="h-px w-full mb-4" />
              
              <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-24" />
              </div>

              <Skeleton className="h-20 w-full mb-4 rounded-lg" />
              
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}