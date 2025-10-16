import { Suspense } from 'react';
import { OrderConfirmationPage } from './order-confirmation-page';
import { OrderConfirmationSkeleton } from './skeleton';

interface OrderConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default function OrderConfirmationWrapper({ searchParams }: OrderConfirmationPageProps) {
  return (
    <Suspense fallback={<OrderConfirmationSkeleton />}>
      <OrderConfirmationPage searchParams={searchParams} />
    </Suspense>
  );
}