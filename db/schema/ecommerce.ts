import { 
  pgTable, 
  text, 
  timestamp, 
  decimal, 
  integer, 
  boolean, 
  index,
  primaryKey
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  slug: text("slug").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  slugIdx: index("categories_slug_idx").on(table.slug),
}));

export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
  imageUrl: text("image_url"),
  images: text("images").array(), // Store multiple image URLs
  stockQuantity: integer("stock_quantity").notNull().default(0),
  sku: text("sku").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  weight: decimal("weight", { precision: 8, scale: 3 }), // in grams
  dimensions: text("dimensions"), // JSON string: {length, width, height}
  careInstructions: text("care_instructions"),
  occasion: text("occasion"), // e.g., "birthday", "anniversary", "wedding"
  flowerType: text("flower_type"), // e.g., "roses", "tulips", "lilies"
  color: text("color"),
  fragrance: text("fragrance"),
  vaseIncluded: boolean("vase_included").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  nameIdx: index("products_name_idx").on(table.name),
  skuIdx: index("products_sku_idx").on(table.sku),
  categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
  activeIdx: index("products_active_idx").on(table.is_active),
  featuredIdx: index("products_featured_idx").on(table.featured),
}));

export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  
  // Shipping information
  shippingAddress: text("shipping_address").notNull(), // JSON string
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  
  // Payment information
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  
  // Timestamps
  orderDate: timestamp("order_date").notNull().defaultNow(),
  shippedDate: timestamp("shipped_date"),
  deliveredDate: timestamp("delivered_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  orderNumberIdx: index("orders_order_number_idx").on(table.orderNumber),
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  statusIdx: index("orders_status_idx").on(table.status),
  orderDateIdx: index("orders_order_date_idx").on(table.orderDate),
}));

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(), // Price at time of purchase
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  productSnapshot: text("product_snapshot"), // JSON string with product details at time of purchase
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
  productIdIdx: index("order_items_product_id_idx").on(table.productId),
}));

export const cart = pgTable("cart", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  sessionId: text("session_id"), // For guest users
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("cart_user_id_idx").on(table.userId),
  sessionIdIdx: index("cart_session_id_idx").on(table.sessionId),
  productIdIdx: index("cart_product_id_idx").on(table.productId),
}));

// Types for TypeScript
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Cart = typeof cart.$inferSelect;
export type NewCart = typeof cart.$inferInsert;