import { Suspense } from 'react';
import { ProductDetailPage } from './product-detail-page';
import { ProductDetailSkeleton } from './skeleton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPageWrapper({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailPage params={params} />
    </Suspense>
  );
}