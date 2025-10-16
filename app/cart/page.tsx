import { Suspense } from 'react';
import { CartPage } from './cart-page';
import { CartPageSkeleton } from './skeleton';

export default function CartPageWrapper() {
  return (
    <Suspense fallback={<CartPageSkeleton />}>
      <CartPage />
    </Suspense>
  );
}