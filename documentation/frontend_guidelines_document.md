# Frontend Guidelines for codeguide-flower-ecommerce

This document describes the frontend setup for the `codeguide-flower-ecommerce` starter template. It covers the architecture, design principles, styling, component structure, state management, routing, performance strategies, testing, and more. The goal is to give any developer—technical or non-technical—a clear roadmap of how the frontend is built and why.

## 1. Frontend Architecture

**Frameworks & Libraries**
- **Next.js (App Router)**: Provides file-based routing, server-side rendering (SSR), and server components for SEO-friendly pages and fast load times.
- **React**: Powers the interactive user interfaces, mixing server and client components to optimize performance.
- **TypeScript**: Adds type safety across the codebase, reducing runtime errors and easing maintenance.
- **Tailwind CSS**: A utility-first CSS framework for rapid, consistent styling.
- **shadcn/ui**: A pre-built, accessible UI component library (cards, buttons, dialogs) that integrates seamlessly with Tailwind.
- **next-themes**: Manages light and dark mode toggling using CSS variables.

**Support for Scalability, Maintainability, Performance**
- **Modular Structure**: Separates UI components, layouts, API routes, and database logic into clearly named folders (`/app`, `/components`, `/lib`, `/db`).
- **Server Components**: By default, Next.js renders many UI pieces on the server, reducing bundle sizes and speeding up initial page loads.
- **Type Safety**: TypeScript ensures that changes in one part of the code are automatically reflected elsewhere, catching errors at compile time.
- **Utility-First CSS**: Tailwind’s purging process removes unused styles, keeping CSS bundles small.
- **Dockerized Development**: A consistent local environment that mirrors production minimizes “works on my machine” issues.

## 2. Design Principles

- **Usability**: Clear, consistent layouts and familiar patterns (header, footer, navigation, product cards) guide users through browsing and checkout.
- **Accessibility**: All `shadcn/ui` components follow WCAG guidelines. Semantic HTML and proper ARIA attributes ensure compatibility with screen readers.
- **Responsiveness**: Mobile-first approach—every page adapts to screen sizes from small phones to large desktops using Tailwind’s responsive utilities.
- **Consistency**: A shared design system with global styles and theme variables keeps colors, typography, and spacing uniform across the app.

_Application in UI Design_:
- Buttons, forms, dialogs, and cards come from the same component library, ensuring consistent spacing and behavior.
- Form fields and interactive elements have clear focus states and alt text where needed.

## 3. Styling and Theming

**Styling Approach**
- **Tailwind CSS**: Utility classes (e.g., `px-4`, `text-gray-700`, `md:flex`) let developers compose designs directly in markup without writing custom CSS.
- **Global CSS Variables**: Defined in `globals.css` to control primary/secondary colors and dark mode overrides.

**Theming**
- **next-themes** toggles between light and dark mode by swapping CSS variables at the root.
- Developers can customize theme colors in `tailwind.config.js` under the `theme.extend.colors` key.

**Visual Style**
- Overall feel: **Modern & Minimalist** with subtle shadows and smooth transitions to highlight product imagery.
- Design accents: Soft corners, ample white space, and gentle hover effects for an elegant flower-shop vibe.

**Color Palette**
- Primary:  `#FF6F61` (Coral)
- Secondary: `#6B705C` (Muted Sage)
- Accent:    `#FFD3B6` (Peach)
- Neutral Light: `#F8F9FA` (Off-white)
- Neutral Dark:  `#343A40` (Charcoal)

**Typography**
- **Headings**: Playfair Display (serif) for a classic, elegant look.
- **Body**: Inter (sans-serif) for readability.
- All font sizes and weights are defined in `tailwind.config.js` under `theme.extend.fontFamily`.

## 4. Component Structure

- **/components**: Home for all reusable UI parts.
  - **/components/ui**: Shadcn/ui components (Button, Card, Dialog, etc.).
  - **Custom Components**: Application-specific pieces like `ProductCard`, `SectionHeader`, `CartSummary`.
- **/app/** (Next.js App Router)
  - Contains page folders (`/sign-in`, `/products/[id]`, `/dashboard`) and shared `layout.tsx`.
  - Mixes server and client components—pages with data fetching are server components by default.

**Benefits of Component-Based Architecture**
- **Reusability**: Build once, use everywhere (e.g., `ProductCard` appears on listing, details, and search pages).
- **Maintainability**: Isolate UI logic in small files makes updates predictable.
- **Testability**: Smaller components are simpler to test in isolation.

## 5. State Management

- **Theming State**: Handled by `next-themes` via React context under the hood.
- **Authentication State**: Managed server-side with cookies and Better Auth sessions; frontend checks session on page load.
- **Recommendations for Advanced State**:
  - **Shopping Cart**: Introduce a lightweight store like Zustand or React Context + useReducer.
  - **Server Data**: Consider React Query for server caching, background updates, and loading states.

## 6. Routing and Navigation

- **File-Based Routing**: Every folder in `/app` automatically becomes a route.
  - Public: `/`, `/sign-in`, `/sign-up`, `/products/[id]`
  - Protected: `/dashboard`, `/cart`, `/checkout` (middleware can guard these).
- **Linking**: Use `<Link>` from `next/link` and the `useRouter` hook from `next/navigation` for client-side transitions.
- **Layouts**:
  - **Root Layout (`/app/layout.tsx`)**: Defines header, footer, and theme provider.
  - **Nested Layouts**: e.g. dashboard layout with side navigation and breadcrumb.

## 7. Performance Optimization

- **Server-Side Rendering**: Critical product pages are SSR’ed for fast first paint and better SEO.
- **Image Optimization**: Next.js `<Image>` automatically resizes and lazy-loads photos.
- **Code Splitting & Lazy Loading**: Dynamic imports (`next/dynamic`) for large components like maps or charts.
- **CSS Purging**: Tailwind removes unused styles based on your content paths.
- **Caching & Revalidation**: Use `revalidate` in `getStaticProps` or Next.js caching headers on API routes.

## 8. Testing and Quality Assurance

**Linters & Formatters**
- **ESLint** with Next.js plugin for consistent JS/TS style.
- **Prettier** for automated code formatting.

**Unit & Integration Testing**
- **Jest** + **@testing-library/react**: Write unit tests for utility functions and small components (e.g., price calculators, form validators).

**End-to-End Testing**
- **Cypress** or **Playwright**: Simulate full user journeys (sign-up, browse products, add to cart, checkout).
- Ensure critical flows like authentication and checkout remain stable across releases.

**Continuous Integration**
- Run lint, format, and test suites on every pull request (GitHub Actions or similar).

## 9. Conclusion and Overall Frontend Summary

The `codeguide-flower-ecommerce` frontend is built on a modern stack—Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui—designed for performance, scalability, and ease of use. Key takeaways:
- **Modular Architecture** separates concerns and simplifies collaboration.
- **Component-Driven Development** speeds up UI creation and ensures consistency.
- **Utility-First Styling** plus a clear theme system delivers fast, brand-aligned designs.
- **Strong Testing & QA** practices keep the code reliable as you grow.

This setup provides a solid foundation for any flower shop e-commerce site. By following these guidelines, you’ll maintain a clean, efficient codebase that delights both developers and customers.