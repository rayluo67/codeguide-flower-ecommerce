'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentFormProps {
  onSubmit: (paymentMethod: string) => void;
  onBack: () => void;
}

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      onSubmit(selectedMethod);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Select Payment Method</h3>
        
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="space-y-3">
            {/* Credit Card */}
            <Card className={`cursor-pointer transition-colors ${
              selectedMethod === 'stripe' ? 'border-primary bg-primary/5' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center cursor-pointer">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <div>
                      <div className="font-medium">Credit Card</div>
                      <div className="text-sm text-gray-500">Pay with Visa, Mastercard, or American Express</div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Digital Wallets */}
            <Card className={`cursor-pointer transition-colors ${
              selectedMethod === 'digital' ? 'border-primary bg-primary/5' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="flex items-center cursor-pointer">
                    <Smartphone className="h-5 w-5 mr-2" />
                    <div>
                      <div className="font-medium">Digital Wallets</div>
                      <div className="text-sm text-gray-500">Apple Pay, Google Pay, or PayPal</div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      {selectedMethod === 'stripe' && (
        <div>
          <h3 className="font-semibold mb-4">Payment Information</h3>
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Secure payment form will appear here
                  </p>
                  <p className="text-xs text-gray-500">
                    Powered by Stripe
                  </p>
                </div>
                
                {/* Mock card form - Replace with actual Stripe Elements */}
                <div className="space-y-3 text-left max-w-sm mx-auto">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    disabled
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border rounded-md bg-white"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-3 py-2 border rounded-md bg-white"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMethod === 'digital' && (
        <div>
          <h3 className="font-semibold mb-4">Digital Wallets</h3>
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button variant="outline" disabled>
                    Apple Pay
                  </Button>
                  <Button variant="outline" disabled>
                    Google Pay
                  </Button>
                  <Button variant="outline" disabled>
                    PayPal
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Digital wallet options will be available on the final payment step
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="font-medium">Secure Payment</span>
        </div>
        <p className="text-sm text-green-600 mt-1">
          Your payment information is encrypted and secure. We never store your credit card details.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back to Shipping
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            'Review Order'
          )}
        </Button>
      </div>
    </div>
  );
}