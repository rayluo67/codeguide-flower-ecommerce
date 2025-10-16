import { z } from 'zod';

// Product query parameters validation
export const ProductQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 12),
  category: z.string().optional(),
  search: z.string().optional(),
  featured: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
});

// Product ID validation
export const ProductIdSchema = z.string().uuid('Invalid product ID format');

// Category slug validation
export const CategorySlugSchema = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Invalid category slug format');

// Cart item validation
export const CartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID format'),
  quantity: z.number().int().min(1).max(99),
});

// Order validation
export const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
  }),
  paymentMethod: z.enum(['stripe', 'paypal']),
});

// Shipping address validation
export const ShippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

export type ProductQuery = z.infer<typeof ProductQuerySchema>;
export type CartItemInput = z.infer<typeof CartItemSchema>;
export type OrderInput = z.infer<typeof OrderSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;