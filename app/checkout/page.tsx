import { Suspense } from 'react';
import { CheckoutPage } from './checkout-page';
import { CheckoutPageSkeleton } from './skeleton';

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<CheckoutPageSkeleton />}>
      <CheckoutPage />
    </Suspense>
  );
}