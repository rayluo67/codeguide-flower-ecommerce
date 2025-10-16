import { Suspense } from 'react';
import { ProductsPage } from './products-page';
import { ProductsPageSkeleton } from './skeleton';

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPage />
    </Suspense>
  );
}