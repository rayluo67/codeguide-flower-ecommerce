# Project Requirements Document: codeguide-flower-ecommerce

## 1. Project Overview

This repository is a full-stack starter template designed to help developers build an online flower shop quickly and reliably. It comes with key building blocks out of the box: secure user authentication, a protected customer dashboard, a flexible UI kit for product pages, a PostgreSQL database schema via Drizzle ORM, light/dark theming, responsive design, and Docker support for consistent local development. By providing these core features in a modern tech stack, it removes the repetitive setup steps and lets you focus directly on customizing your flower shop’s unique branding and business logic.

The main goal is to accelerate time-to-market for a feature-rich flower e-commerce site while ensuring performance, maintainability, and good developer experience. Success means you can clone this template and immediately sign up users, manage sessions, extend the database with product and order tables, and deploy the app with minimal friction. Future growth — like adding a shopping cart, checkout flow, and admin panel — will build upon this clear, type-safe foundation.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)
- User authentication: signup, signin, signout using Better Auth and Next.js API Routes
- Customer dashboard skeleton: protected route with placeholder for order history and account details
- Storefront UI kit: reusable components (cards, buttons, dialogs) via shadcn/ui and Tailwind CSS
- Database integration: PostgreSQL connection and user/session tables managed by Drizzle ORM
- Theming: dark/light mode toggle powered by next-themes
- Responsive design: mobile, tablet, and desktop layouts via Tailwind utilities
- Containerization: Docker & Docker Compose files for app and database
- SEO-ready pages: server-side rendering with Next.js App Router

### Out-of-Scope (Later Phases)
- Product catalog CRUD endpoints and pages
- Shopping cart state management and UI
- Checkout & payment flow (Stripe, PayPal, etc.)
- Admin or back-office panel for managing inventory or orders
- Advanced features: wishlists, subscriptions, loyalty programs
- Automated testing (unit, integration, e2e)
- Image optimization beyond Next.js `<Image>` defaults
- Analytics, search, or recommendation engine

## 3. User Flow

A new visitor lands on the storefront’s homepage and sees a site header, footer, and sample product cards rendered from the UI kit. They can click “Sign Up” to create an account. Choosing a username, email, and password, they submit the form, which calls the `/api/auth/sign-up` endpoint. On success, they receive a session cookie and are redirected to their customer dashboard.

Once logged in, the user sees their dashboard page with a welcome message and placeholder sections for order history and saved addresses. From there, they can navigate back to the storefront via the site header. If they sign out, they return to the public area. Throughout this flow, the layout adjusts seamlessly between mobile and desktop, and the user can toggle between light and dark themes.

## 4. Core Features

- **Authentication**: Secure signup/signin/signout with Better Auth and Drizzle ORM adapters
- **Customer Dashboard**: Protected route displaying account placeholders, ready for extension
- **UI Components**: shadcn/ui & Tailwind CSS building blocks (buttons, cards, dialogs)
- **Database Layer**: PostgreSQL and Drizzle ORM schema for users and sessions
- **Theming**: Dark/light mode switch via next-themes and CSS variables
- **Responsive Layout**: Utility-first design for all screen sizes
- **API Routes**: Next.js serverless functions for auth logic
- **Containerization**: Docker Compose setup for app + database
- **SEO & Performance**: Next.js SSR for fast, indexable pages

## 5. Tech Stack & Tools

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, next-themes
- **Backend**: Next.js API Routes, Better Auth library, Drizzle ORM, PostgreSQL
- **Infrastructure**: Docker, Docker Compose, Vercel (recommended for hosting)
- **Developer Tools**: VS Code (recommended), Prettier & ESLint (setup suggested), `dotenv` for environment variables
- **CI/CD**: GitHub Actions or Vercel’s automated deployments (not pre-configured)

## 6. Non-Functional Requirements

- **Performance**: Page Time-to-First-Byte (TTFB) under 200 ms, full page load under 2 seconds on average broadband
- **Security**: HTTPS for all traffic, secure cookies (HttpOnly, SameSite), input validation to prevent XSS/SQL injection
- **Scalability**: Support for horizontal scaling via stateless Next.js functions and a managed database
- **Availability**: 99.9% uptime goal when deployed on a cloud provider
- **Accessibility**: WCAG 2.1 AA compliance for core UI components
- **Maintainability**: Type-safe codebase (TypeScript), modular components, consistent linting/formatting

## 7. Constraints & Assumptions

- Requires Node.js v18+ and Docker installed locally
- Assumes PostgreSQL 14+ for production and development containers
- Depends on Better Auth and Drizzle ORM being up-to-date with the current Next.js version
- Environment variables (e.g., DATABASE_URL, AUTH_SECRET) are managed via a `.env` file
- No third-party payment or search services integrated yet
- Vercel recommended but not mandatory—any Node.js host will work

## 8. Known Issues & Potential Pitfalls

- **Database Migrations**: Drizzle ORM may need manual migration scripts; include a migration workflow early to avoid schema drift.
- **Auth Cookie Configuration**: Misconfigured `SameSite` or domain settings can block cookies in production; test on staging domains.
- **Container Networking**: Docker Compose service names must match connection strings; include health checks and retries for the database.
- **Package Version Drift**: Lock `better-auth`, `drizzle-orm`, and `next` versions in `package.json` to prevent breaking changes after updates.
- **Flash of Unstyled Content (FOUC)**: next-themes can briefly show the wrong theme on page load; add a small preloader or `<script>` to read and apply the theme from localStorage.
- **Error Handling**: API routes need robust try/catch blocks and clear error messages; standardize error responses to simplify frontend handling.

By following this PRD, an AI or a developer can generate the detailed technical design, frontend guidelines, backend structure, and file organization needed to build out a complete, production-ready flower e-commerce platform without missing any critical piece of information.