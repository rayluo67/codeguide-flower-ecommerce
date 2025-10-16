CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"slug" text NOT NULL,
	"is_active" boolean NOT NULL DEFAULT true,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" decimal(10,2) NOT NULL,
	"category_id" text NOT NULL,
	"image_url" text,
	"images" text[],
	"stock_quantity" integer NOT NULL DEFAULT 0,
	"sku" text NOT NULL,
	"is_active" boolean NOT NULL DEFAULT true,
	"featured" boolean NOT NULL DEFAULT false,
	"weight" decimal(8,3),
	"dimensions" text,
	"care_instructions" text,
	"occasion" text,
	"flower_type" text,
	"color" text,
	"fragrance" text,
	"vase_included" boolean DEFAULT false,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"order_number" text NOT NULL,
	"status" text NOT NULL DEFAULT 'pending',
	"total_amount" decimal(10,2) NOT NULL,
	"subtotal" decimal(10,2) NOT NULL,
	"tax_amount" decimal(10,2) NOT NULL DEFAULT '0.00',
	"shipping_amount" decimal(10,2) NOT NULL DEFAULT '0.00',
	"shipping_address" text NOT NULL,
	"shipping_method" text,
	"tracking_number" text,
	"payment_method" text,
	"payment_status" text NOT NULL DEFAULT 'pending',
	"stripe_payment_intent_id" text,
	"order_date" timestamp NOT NULL DEFAULT now(),
	"shipped_date" timestamp,
	"delivered_date" timestamp,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" decimal(10,2) NOT NULL,
	"total_price" decimal(10,2) NOT NULL,
	"product_snapshot" text,
	"created_at" timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_id" text,
	"product_id" text NOT NULL,
	"quantity" integer NOT NULL DEFAULT 1,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" ("slug");
--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" ("name");
--> statement-breakpoint
CREATE INDEX "products_sku_idx" ON "products" ("sku");
--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" ("category_id");
--> statement-breakpoint
CREATE INDEX "products_active_idx" ON "products" ("is_active");
--> statement-breakpoint
CREATE INDEX "products_featured_idx" ON "products" ("featured");
--> statement-breakpoint
CREATE INDEX "orders_order_number_idx" ON "orders" ("order_number");
--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" ("user_id");
--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" ("status");
--> statement-breakpoint
CREATE INDEX "orders_order_date_idx" ON "orders" ("order_date");
--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" ("order_id");
--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" ("product_id");
--> statement-breakpoint
CREATE INDEX "cart_user_id_idx" ON "cart" ("user_id");
--> statement-breakpoint
CREATE INDEX "cart_session_id_idx" ON "cart" ("session_id");
--> statement-breakpoint
CREATE INDEX "cart_product_id_idx" ON "cart" ("product_id");
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_unique" UNIQUE("slug");
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sku_unique" UNIQUE("sku");
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_unique" UNIQUE("order_number");