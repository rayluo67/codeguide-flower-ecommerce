# Security Guidelines for codeguide-flower-ecommerce

This document provides comprehensive security guidelines tailored to the **codeguide-flower-ecommerce** starter template. It embeds security best practices into every layer—architecture, code, infrastructure, and operations—to ensure your flower shop platform is secure by design.

---

## 1. Security by Design

- Embed security in planning and development, not as an afterthought.  
- Perform threat modeling for key flows (e.g., user authentication, checkout).  
- Define clear roles and responsibilities (developers, DevOps, security reviewers).
- Conduct regular security reviews on design changes or new features.

## 2. Authentication & Access Control

### 2.1. Robust Authentication
- Use **Better Auth** with secure defaults: enforce bcrypt/Argon2 password hashing with unique salts.  
- Ensure all auth API routes (`/api/auth/*`) require proper validation and rate limiting to block brute-force attacks.  
- Enforce strong password policy (minimum length, complexity, rotate on breach).  

### 2.2. Session Management
- Store session identifiers in **HttpOnly**, **Secure**, **SameSite=Strict** cookies.  
- Set both idle and absolute session timeouts.  
- Provide explicit logout endpoint to invalidate sessions server-side.  
- Protect against session fixation by renewing session IDs on privilege elevation.

### 2.3. Role-Based Access Control (RBAC)
- Define roles (e.g., `customer`, `admin`) and associated permissions.  
- Enforce authorization checks server-side in Next.js API routes and server components.  
- Never trust client-provided role claims—always verify against database or secure JWT claims.

### 2.4. Multi-Factor Authentication (MFA)
- Plan for optional MFA on sensitive actions (e.g., changing payment info, admin login).  
- Leverage TOTP (Time-based One-Time Password) or SMS/Email as second factor.

---

## 3. Input Handling & Processing

### 3.1. Prevent Injection Attacks
- Use Drizzle ORM’s parameterized queries to avoid SQL injection.  
- Validate all inputs (product IDs, search queries, user profiles) with a schema validation library (e.g., Zod).  
- Escape or sanitize any dynamic parameters used in raw queries.

### 3.2. Prevent XSS (Cross-Site Scripting)
- Apply context-aware encoding when rendering user-provided data in React components.  
- Enable a strict Content Security Policy (CSP) via Next.js `headers()` configuration.  
- Sanitize any rich text inputs (e.g., gift messages) with a whitelist-based sanitizer.

### 3.3. CSRF Protection
- Use CSRF tokens for all state-changing API routes (`POST`, `PUT`, `DELETE`).  
- Implement synchronizer token pattern or leverage NextAuth/Better Auth built-in CSRF mitigations.

### 3.4. Secure File Uploads (if applicable)
- Validate file type, size, and content before acceptance.  
- Store uploaded assets outside the webroot or on a dedicated object storage (e.g., AWS S3) with restricted ACL.  
- Scan uploads with antivirus or malware detection.

---

## 4. Data Protection & Privacy

### 4.1. Encryption in Transit & At Rest
- Enforce HTTPS/TLS 1.2+ on all front-end/back-end communication (Vercel auto-configures HTTPS).  
- Enable database encryption at rest (PostgreSQL encryption extensions or managed DB encryption).  
- Use strong cipher suites; disable deprecated protocols (SSLv3, TLS&nbsp;1.0/1.1).

### 4.2. Secrets Management
- Never hardcode secrets in code.  
- Store sensitive config (DB credentials, JWT keys, Stripe API keys) in a secrets manager (e.g., Vercel Environment Variables, HashiCorp Vault, AWS Secrets Manager).  
- Rotate secrets regularly and on suspicion of compromise.

### 4.3. Minimize PII Exposure
- Only collect necessary customer data (name, email, shipping address).  
- Mask or redact PII in logs and error messages.  
- Implement data retention policies to purge stale PII in compliance with GDPR/CCPA.

---

## 5. API & Service Security

### 5.1. HTTPS & CORS
- Force HTTPS on all endpoints.  
- Restrict CORS to trusted origins (your domain and any staging URLs).  
- Disallow wildcard `Access-Control-Allow-Origin` in production.

### 5.2. Rate Limiting & Throttling  
- Apply rate limiting on authentication, checkout, and product-search endpoints to mitigate DoS and brute-force.  
- Use an API gateway or middleware (e.g., Express-rate-limit, Vercel Edge Middleware) for global limits.

### 5.3. API Versioning & Least Exposure
- Version your REST endpoints (e.g., `/api/v1/products`).  
- Only expose fields needed by the client response to reduce data leakage.

---

## 6. Web Application Security Hygiene

### 6.1. Security Headers
- Implement in Next.js `next.config.js` under `headers()`:
  • Content-Security-Policy  
  • Strict-Transport-Security (HSTS)  
  • X-Content-Type-Options: nosniff  
  • X-Frame-Options: DENY  
  • Referrer-Policy: strict-origin-when-cross-origin

### 6.2. Secure Cookies
- All application cookies (session, CSRF) should be `HttpOnly`, `Secure`, `SameSite=Strict` by default.

### 6.3. Disable Debug in Production
- Ensure `NEXT_PUBLIC_...` env variables expose no secrets.  
- Build with `NODE_ENV=production`; disable source maps and detailed error stacks in Next.js.

### 6.4. Protect Client-Side Storage
- Avoid storing JWTs or PII in `localStorage` or `sessionStorage`.  
- Prefer HttpOnly cookies for session management.

---

## 7. Infrastructure & Configuration Management

### 7.1. Container Security
- Use minimal, official Node.js Docker images.  
- Regularly scan images with tools like Trivy or Clair.  
- Run containers as non-root users.

### 7.2. Hardening & Patching  
- Disable unused services in Docker and host machines.  
- Keep OS, dependencies, and Docker base images up to date with security patches.

### 7.3. Network & Ports
- Expose only necessary ports (e.g., 80/443 for web, 5432 exclusively to application network).  
- Use internal networks for container communication (Docker Compose `internal: true`).

### 7.4. Secrets in CI/CD  
- In your pipeline (e.g., GitHub Actions, GitLab CI), store secrets in secure vault or encrypted secrets store.  
- Approve manual deployments to production to prevent unauthorized push.

---

## 8. Dependency Management

- Lock dependencies with `package-lock.json` or `yarn.lock` for reproducible builds.  
- Regularly run SCA tools (Dependabot, Snyk, npm audit) to identify vulnerable packages.  
- Remove unused packages to reduce attack surface.  
- Vet any UI or utility library (`shadcn/ui`, `tailwindcss`, `react-hot-toast`) for active maintenance and known CVEs.

---

## 9. Monitoring, Logging & Incident Response

- Implement structured, sanitized logs (no PII) using a logging library (e.g., Winston, Pino).  
- Monitor for suspicious activity (multiple failed logins, high request rates).  
- Set up alerting (e.g., Slack, email) for anomalies and critical errors.  
- Maintain an incident response plan: detect, contain, eradicate, recover, and post-mortem.

---

## 10. Testing & Validation

- **Static Analysis**: Integrate ESLint with security-focused plugins (eslint-plugin-security).  
- **Unit & Integration Tests**: Validate business logic (payment calculations, address validation) with Jest.  
- **Dynamic Scanning**: Run OWASP ZAP or Burp Suite scans against a staging environment.  
- **Penetration Tests**: Schedule periodic external pentests for high-risk features (checkout, auth).

---

## 11. Continuous Improvement

- Review and update this guideline whenever new features or dependencies are introduced.  
- Schedule quarterly security reviews and dependency audits.  
- Provide developer training on secure coding, threat modeling, and OWASP Top 10.

---

By following these security guidelines, **codeguide-flower-ecommerce** will be fortified against common threats and positioned for safe growth as a production-ready flower e-commerce platform.