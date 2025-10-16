# App Flow Document for the Flower Shop E-commerce Starter Template

## Onboarding and Sign-In/Sign-Up
A brand-new visitor lands on the public homepage of the application by navigating to the root URL. From here, they can browse placeholder content or click a prominent “Sign Up” button in the header. The Sign-Up page presents a simple form asking for an email address and password. After filling in these fields and clicking “Create Account,” the form sends the information to the `/api/auth/sign-up` endpoint where Better Auth and Drizzle ORM validate and store the new user record. Upon successful account creation, the user is automatically logged in and redirected to the protected Dashboard area.

If the user already has an account, they can instead choose “Sign In” in the header. The Sign-In page asks for the same email and password combination. Submitting this form sends a request to `/api/auth/sign-in`, where credentials are checked against stored records. On success, a session cookie is set and the user is redirected to the Dashboard. On failure, a clear error message appears above the form explaining that their email or password is incorrect. The template does not include a built-in password recovery flow, but this can be added later under a “Forgot Password” link.

Signing out is straightforward. Once logged in, the user sees a “Sign Out” link in the header or dropdown menu. Clicking that triggers a call to `/api/auth/sign-out`, clears the session cookie, and returns the visitor to the public homepage.

## Main Dashboard or Home Page
After logging in, the user lands on their Dashboard at `/dashboard`. The global header remains visible, now showing the user’s name and a sign-out option. Below the header, the Dashboard displays a welcome message and space for future features like order history or saved addresses. A sidebar (or top navigation bar on mobile) lists links to key sections such as “Dashboard,” “Products,” and “Account Settings.” The main content area defaults to a summary view but can be extended to show recent orders or recommended bouquets.

When the user clicks the logo in the header, they are returned to the public homepage where they can resume browsing product listings (as those are built out). If they select “Products,” the app navigates to `/products` to show a list of bouquets. The layout uses the shared root layout from `layout.tsx` so the header, footer, and theme toggle remain consistent.

## Detailed Feature Flows and Page Transitions

### Authentication Flow
From the public homepage, clicking “Sign In” or “Sign Up” takes the user to the respective form. Submitting credentials calls the Next.js API Routes under `/api/auth`. On success, Better Auth issues a session cookie and redirects the user to `/dashboard`. If the user manually types a protected URL like `/dashboard` while not signed in, the middleware intercepts and automatically redirects them to `/sign-in`.

### Theme Switching
The app supports light and dark modes via `next-themes`. A toggle button in the header lets the user switch themes at any time. Clicking the toggle updates a client-side theme setting and persists the choice in local storage. The entire application re-renders in the selected theme without reloading the page.

### Navigation Between Pages
Users navigate using the header links or sidebar. Selecting “Products” goes to `/products`. Clicking on a product card in the product list (once implemented) transitions to `/products/[productId]`, showing detailed information. From a product detail page, the user can click “Add to Cart” (future feature) which updates client-side state. The user may then proceed to `/cart` to review items and continue to `/checkout` for the payment process.

## Settings and Account Management
In the Dashboard sidebar, an “Account Settings” link guides users to a page at `/dashboard/settings`. There they can update their email address or password. Each update form sends data to dedicated API routes under `/api/account`. On success, a confirmation message appears and the user remains on the settings page. They can click “Back to Dashboard” to return to the main dashboard view.

Because this template focuses on the core authentication and layout, subscription or billing settings are not included by default. If needed, an additional section under `/dashboard/billing` can be developed to let users manage payment methods or subscription plans.

## Error States and Alternate Paths
If a user enters the wrong credentials on sign-in, the form displays an inline error above the input fields. If a network request fails, a generic message appears asking the user to check their connection and retry. When an authenticated user attempts to navigate to a non-existent page under `/dashboard`, they see a 404 page styled with the same header and footer. If the session expires while on a protected route, the user is automatically redirected back to `/sign-in` with a notice that their session has ended.

## Conclusion and Overall App Journey
From the moment a visitor arrives on the public homepage, they can explore the site, create an account, and log in using a familiar email/password flow. Once authenticated, they land on a clean Dashboard with navigation to products and settings. Theme toggling remains available throughout. Error messages guide users back on track whenever something goes wrong. As they log out, they return to the public view and can repeat the cycle. This clear foundation makes it easy to extend the app with product browsing, cart management, checkout, and an admin panel—delivering a complete end-to-end e-commerce experience for a flower shop.