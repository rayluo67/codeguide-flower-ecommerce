'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Truck, Shield, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { ShippingAddressForm } from './shipping-address-form';
import { PaymentForm } from './payment-form';
import { OrderSummary } from './order-summary';
import { ShippingAddress } from '@/lib/types/ecommerce';

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'processing';

export function CheckoutPage() {
  const router = useRouter();
  const { state } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Shield },
  ] as const;

  const getStepProgress = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    return ((stepIndex + 1) / steps.length) * 100;
  };

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (paymentMethod: string) => {
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;

    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      // TODO: Implement order creation logic
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress,
          paymentMethod: 'stripe', // Default to Stripe
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      
      // Redirect to order confirmation page
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      // TODO: Show error message
      setCurrentStep('review');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some flowers to your cart before checking out.</p>
          <Link href="/products">
            <Button size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                    'border-gray-300 text-gray-400'}
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-full h-0.5 mx-4 ${
                    steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 'shipping' && <Truck className="h-5 w-5" />}
                {currentStep === 'payment' && <CreditCard className="h-5 w-5" />}
                {currentStep === 'review' && <Shield className="h-5 w-5" />}
                {currentStep === 'processing' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />}
                {steps.find(s => s.id === currentStep)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 'shipping' && (
                <ShippingAddressForm 
                  onSubmit={handleShippingSubmit}
                  initialData={shippingAddress}
                />
              )}
              
              {currentStep === 'payment' && (
                <PaymentForm 
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setCurrentStep('shipping')}
                />
              )}
              
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{shippingAddress?.name}</p>
                      <p className="text-gray-600">{shippingAddress?.address}</p>
                      <p className="text-gray-600">
                        {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}
                      </p>
                      <p className="text-gray-600">{shippingAddress?.country}</p>
                      <p className="text-gray-600">{shippingAddress?.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit Card (Stripe)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                🌸
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.product.price)} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      disabled={isProcessing}
                    >
                      Back to Payment
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'processing' && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Processing Your Order</h3>
                  <p className="text-gray-600">Please wait while we process your payment and create your order.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary 
            items={state.items}
            subtotal={parseFloat(state.total)}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}