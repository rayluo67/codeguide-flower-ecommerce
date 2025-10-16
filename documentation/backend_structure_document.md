# Backend Structure Document

## 1. Backend Architecture

This section describes how the backend of the codeguide-flower-ecommerce project is organized and why it’s designed that way.

• Overall design
  - Built on Next.js API Routes: each endpoint lives alongside the frontend code, making it easy to see how data flows.  
  - Uses Better Auth for handling sign-up, sign-in, sessions, and access control.  
  - Drizzle ORM sits between the code and PostgreSQL, providing type-safe queries and migrations.

• Design patterns and frameworks
  - Controller pattern: each API route acts like a controller, handling requests and returning JSON.  
  - Repository layer (via Drizzle ORM): abstracts database operations so business logic stays clean.  
  - Middleware: authentication checks run before protected routes, ensuring only logged-in users can access certain data.

• Scalability, maintainability, performance
  - Serverless functions on Vercel automatically scale with traffic—no manual provisioning needed.  
  - TypeScript everywhere reduces runtime errors and makes refactoring safer.  
  - Clear separation of concerns (API routes vs. database vs. UI) keeps the code easy to maintain.  
  - Server-side rendering (SSR) of product pages boosts SEO and speeds up first-load times for customers.

---

## 2. Database Management

This section explains the database technologies, how data is organized, and key practices.

• Technologies used:
  - PostgreSQL (relational SQL database)  
  - Drizzle ORM (type-safe ORM for building queries and migrations)

• Data structure and access
  - Tables represent entities like users, sessions, products, categories, orders, and order items.  
  - Drizzle ORM generates SQL under the hood, so developers write queries in TypeScript rather than raw SQL.  
  - Migrations are managed via Drizzle CLI, ensuring schema changes are applied consistently across environments.

• Best practices
  - Index foreign keys (e.g., `product.categoryId`, `order.userId`) for faster JOINs.  
  - Enforce not-null and unique constraints on critical columns (e.g., `users.email`).  
  - Use database transactions for multi-step operations (like creating an order and its items) to maintain data integrity.

---

## 3. Database Schema

Below is a human-readable overview of each table, followed by the PostgreSQL schema in SQL.

### Human-Readable Schema

• Users  
  - id (primary key)  
  - email (unique, required)  
  - passwordHash  
  - createdAt, updatedAt

• Sessions  
  - id (primary key)  
  - userId (foreign key → Users.id)  
  - expiresAt

• Categories  
  - id (primary key)  
  - name (unique)  
  - createdAt

• Products  
  - id (primary key)  
  - name  
  - description  
  - price  
  - imageUrl  
  - stockQuantity  
  - categoryId (foreign key → Categories.id)  
  - createdAt, updatedAt

• Orders  
  - id (primary key)  
  - userId (foreign key → Users.id)  
  - totalAmount  
  - status (e.g., “pending,” “paid,” “shipped”)  
  - createdAt

• OrderItems  
  - id (primary key)  
  - orderId (foreign key → Orders.id)  
  - productId (foreign key → Products.id)  
  - quantity  
  - unitPrice

### PostgreSQL Schema (SQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);
```

---

## 4. API Design and Endpoints

We use RESTful endpoints implemented via Next.js API Routes. Each route lives under `pages/api` or `app/api`.

• Auth endpoints
  - POST /api/auth/sign-up → creates a new user  
  - POST /api/auth/sign-in → validates credentials and starts a session  
  - POST /api/auth/sign-out → ends the session  
  - GET  /api/auth/session → retrieves current session info

• Product and category endpoints
  - GET    /api/products → list all products  
  - GET    /api/products/[id] → get details for one product  
  - POST   /api/products → add a new product (admin only)  
  - PUT    /api/products/[id] → update a product (admin only)  
  - DELETE /api/products/[id] → remove a product (admin only)  
  - GET    /api/categories → list all categories

• Order endpoints
  - GET  /api/orders → list orders for the logged-in user  
  - POST /api/orders → create a new order and its items  
  - GET  /api/orders/[id] → fetch a single order’s details

• Cart (optional)
  - GET    /api/cart → retrieve the user’s current cart  
  - POST   /api/cart  → add or update items in the cart  
  - DELETE /api/cart  → clear or remove items from the cart

Each endpoint returns JSON and appropriate HTTP status codes. Protected routes check for a valid session cookie via middleware.

---

## 5. Hosting Solutions

• Development environment
  - Docker & Docker Compose: spins up both the Next.js app and PostgreSQL with a single command, ensuring dev/prod parity.

• Production environment
  - Vercel: our recommended host, offering:  
    - Automatic deployments on every push  
    - Serverless functions for API Routes  
    - Global Edge Network (CDN) for static assets  
    - Built-in environment variable management

Benefits:
  - Reliability: Vercel SLA and automatic rollbacks.  
  - Scalability: serverless endpoints scale to zero or handle high traffic without manual tuning.  
  - Cost-effectiveness: pay only for the compute and bandwidth you use.

---

## 6. Infrastructure Components

• Load balancing
  - Built into Vercel’s serverless platform; requests route to the nearest edge node.

• Caching mechanisms
  - Next.js Incremental Static Regeneration (ISR): cache product pages and revalidate in the background.  
  - HTTP cache headers on API responses where appropriate.

• Content Delivery Network (CDN)
  - Vercel Edge Network caches static assets (images, CSS, JS) at points of presence around the world.

• Database hosting
  - Managed PostgreSQL (on-premise or cloud provider like Supabase/Heroku/RDS) with automated backups and scaling.

• Containerization (local only)
  - Docker images for the app and database ensure everyone develops against the same environment.

---

## 7. Security Measures

• Authentication & authorization
  - Better Auth handles hashing, session cookies, and token management.  
  - Middleware checks ensure only authenticated users can access protected routes (e.g., orders, dashboard).

• Data encryption
  - TLS/HTTPS enforced in production.  
  - Managed database encryption at rest (provided by cloud host).

• Secret management
  - Environment variables stored securely in Vercel or a secrets manager (no secrets in code).  

• Additional best practices
  - Rate limiting on sensitive endpoints to prevent brute-force attacks.  
  - HTTP security headers (Content Security Policy, X-Frame-Options, etc.) via next-helmet or Vercel Edge Middleware.  
  - Input validation with libraries like Zod to prevent SQL injection and XSS.

---

## 8. Monitoring and Maintenance

• Performance monitoring
  - Vercel Analytics: real-time insights into traffic, latency, and error rates.  
  - Optionally integrate Sentry for detailed error tracking and performance profiling.

• Logging
  - Built-in logs in Vercel dashboard for serverless functions.  
  - Console and application logs captured during development via Docker logs.

• CI/CD
  - GitHub Actions or Vercel Git integration runs automated tests and linters on each PR.  

• Maintenance strategies
  - Regular dependency updates using tools like Dependabot.  
  - Scheduled database backups and health checks.  
  - Periodic security audits and vulnerability scans.

---

## 9. Conclusion and Overall Backend Summary

The backend for codeguide-flower-ecommerce is a modern, full-stack solution built on Next.js API Routes, Better Auth, and PostgreSQL with Drizzle ORM. It is designed for:

• Scalability: serverless functions and managed database scale automatically.  
• Maintainability: TypeScript, clear folder structure, and migrations keep the codebase clean and easy to evolve.  
• Performance: SSR, ISR, and a global CDN ensure fast page loads and great SEO.  
• Security: robust authentication, encrypted data, and best practices protect customer information.

With this foundation in place, extending the platform—whether adding new product features, a shopping cart, payment integration, or an admin dashboard—will be straightforward and reliable.