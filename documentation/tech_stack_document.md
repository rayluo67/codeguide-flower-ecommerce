# Tech Stack Document for codeguide-flower-ecommerce

This document explains, in everyday language, the technology choices behind the `codeguide-flower-ecommerce` starter template. Each section covers a different part of the system so that anyone—technical or not—can understand how and why these tools were selected.

## 1. Frontend Technologies

These tools power everything your customers see and interact with on the website.

- **Next.js**
  - Manages page routing and server-side rendering (SSR), which helps search engines find and rank your flower product pages.
- **React**
  - Builds the interactive parts of your site (like adding a bouquet to the cart) by breaking the interface into small, reusable pieces.
- **TypeScript**
  - Adds simple, built-in checks to catch mistakes early (for example, mixing up product prices and names).
- **Tailwind CSS**
  - A fast way to apply styling rules, letting you quickly design layouts and color schemes without writing long CSS files.
- **shadcn/ui**
  - A ready-made library of buttons, cards, dialogs, and other interface pieces that give your shop a polished look right away.
- **next-themes**
  - Lets customers switch between light and dark modes to match their preferences or your brand’s style.

How they enhance user experience:
- Server-side rendering ensures fast page loads and better search engine visibility.
- Reusable components mean a consistent look and feel across the site.
- Utility-first styling (Tailwind) accelerates design updates without deep CSS expertise.

## 2. Backend Technologies

These choices handle all the behind-the-scenes work like user accounts, data storage, and server logic.

- **Next.js API Routes**
  - Built into Next.js to handle server requests (for example, sign-in, retrieving product lists, placing orders).
- **better-auth**
  - A library that simplifies secure sign-up, sign-in, and session management for your customers.
- **PostgreSQL**
  - A reliable database for storing structured information such as products, orders, and customer details.
- **Drizzle ORM**
  - A modern tool that connects your code to the PostgreSQL database in a type-safe way, making it easy to read and write data.

How they work together:
1. A customer fills in a form (sign-in or order).
2. Next.js API Routes receive that data.
3. `better-auth` checks credentials against the `users` table in PostgreSQL.
4. Drizzle ORM runs the queries to fetch or store data (orders, product details).
5. The server sends back a response, and the frontend updates accordingly.

## 3. Infrastructure and Deployment

These choices keep the application running smoothly, from development on your machine to a live site.

- **Docker & Docker Compose**
  - Packages the application and database together so every developer’s environment matches production exactly.
- **Vercel**
  - A hosting platform optimized for Next.js; handles building, scaling, and serving your site with minimal configuration.
- **Git & GitHub**
  - Version control keeps track of every change to your code. GitHub also lets you collaborate with others and trigger automated checks.
- **CI/CD Pipelines (e.g., GitHub Actions)**
  - Automatically build and test your code every time you (or a teammate) make a change, ensuring new updates don’t break existing features.

Benefits:
- Consistent environments reduce “it works on my machine” problems.
- Automated builds and tests speed up safe deployments.
- Scalable hosting means your shop can handle traffic spikes (e.g., Valentine’s Day orders).

## 4. Third-Party Integrations

These external services and libraries add specialized functionality without reinventing the wheel.

- **shadcn/ui** (UI components)
- **better-auth** (authentication library)
- **next-themes** (theme management)

Planned or easily added integrations:
- **Stripe or PayPal**
  - Secure, popular payment gateways to process credit cards and digital wallets.
- **react-hot-toast**
  - A simple notification library to show messages like “Bouquet added to cart!”
- **Zustand or React Query**
  - Client-side data management tools for handling shopping cart state and server data fetching.

Benefits:
- Off-the-shelf solutions reduce development time and maintenance.
- Well–supported libraries and services offer documentation and community support.

## 5. Security and Performance Considerations

We’ve built in several measures to keep data safe and the site responsive.

Security:
- **better-auth** uses secure, HTTP-only cookies to manage sessions.
- **PostgreSQL** stores data in a proven, encrypted-at-rest database.
- **Next.js** server routes can be locked down so only signed-in users can access protected pages (like the dashboard).

Performance:
- **Server-Side Rendering (SSR)** for SEO and faster first-load times.
- **Next.js `<Image>` Component** (recommended) to automatically optimize product photos.
- **Utility-first CSS (Tailwind)** and component-driven UI reduce unused styles and speed up rendering.
- **Docker** ensures the app runs the same way in every environment, preventing performance surprises.

## 6. Conclusion and Overall Tech Stack Summary

This starter template combines modern, well-supported tools to deliver a high-quality foundation for your flower e-commerce platform:

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, next-themes
- Backend: Next.js API Routes, better-auth, PostgreSQL, Drizzle ORM
- Infrastructure: Docker, Docker Compose, Vercel, GitHub, CI/CD pipelines
- Third-Party (current & planned): UI and auth libraries, payment gateways, notification tools
- Security & Performance: Secure cookies, SSR, optimized images, consistent environments

These choices align with the goals of an online flower shop: beautiful, responsive product pages; secure and easy account management; reliable order processing; and a developer-friendly workflow that accelerates feature development and future growth.