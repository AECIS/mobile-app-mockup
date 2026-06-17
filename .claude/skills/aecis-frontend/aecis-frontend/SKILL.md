---
name: aecis-frontend
description: AECIS v2 frontend knowledge — multi-tenant URL routing, component usage with shadcn/ui, JWT auth/RBAC security, and middleware pipeline. Use when building or modifying frontend features, creating routes, or handling auth/security in the Next.js 14 app.
---

# AECIS Frontend

## Overview

AECIS v2 frontend is a Next.js 14 multi-tenant AEC project management app using TypeScript, TailwindCSS, and shadcn/ui. URLs are workspace-scoped; middleware rewrites browser URLs to internal file paths.

## Routing

### URL Patterns

| Category | Browser URL | Internal Path |
|----------|-------------|---------------|
| System Admin | `/admin/*` | `/admin/*` (no rewrite) |
| Workspace Admin | `/{ws}/admin/*` | `/admin/*` |
| Project Admin | `/{ws}/admin/{pid}/*` | `/admin/projects/{pid}/*` |
| Project User | `/{ws}/{pid}/*` | `/projects/{pid}/*` |
| Reserved | `/login`, `/profile`, etc. | direct (no rewrite) |

### URL Builder (ALWAYS use — never hardcode routes)

```typescript
import { buildProjectUrl, buildAdminUrl } from "@/lib/url-builder";
import useURLContext from "@/hooks/useURLContext";

buildProjectUrl("acme", "123", "tasks")           // → /acme/123/tasks
buildAdminUrl("acme", null, "users")               // → /acme/admin/users
buildAdminUrl("acme", "123", "settings")           // → /acme/admin/123/settings
buildAdminUrl(null, null, "workspaces")             // → /admin/workspaces
```

### Context Hook (client-side source of truth)

```typescript
const { workspaceSlug, projectId, category, isAdminRoute } = useURLContext();
```

### Key Files

- `src/config/route-patterns.ts` — `parseURLPath()`, `RESERVED_PATHS`, `RouteCategory`
- `src/lib/url-builder.ts` — `buildProjectUrl()`, `buildAdminUrl()`, `getWorkspaceSlugFromProject()`
- `src/lib/route-matcher.ts` — `matchAndRewriteURL()`, context headers
- `src/hooks/useURLContext.ts` — Client hook, `useURLContext()`
- `src/middleware.ts` — Full pipeline: security → JWT auth → RBAC → legacy redirects → URL rewrite
- `src/config/menu.config.ts` — Menu items with `transformMenuRoutes()` for workspace-scoped links

## Security

### Middleware Auth Pipeline (7 steps)

1. Security headers (X-Frame-Options, CSP, etc.)
2. JWT check: read `auth_token` httpOnly cookie, validate expiry
3. Unauthenticated → redirect to `/login?redirect={path}`
4. Already authenticated on auth page → redirect to `/choose-project`
5. RBAC: `/admin/*` requires `SystemAdmin`; workspace/project-admin requires admin roles
6. Workspace validation: URL workspace vs `aecis-workspace` cookie (SystemAdmin bypasses)
7. URL rewriting + context header injection

### JWT Edge Runtime (`src/lib/jwt-edge.ts`)

- `decodeJWTPayload(token)` — base64url decode, no signature verification
- `isTokenExpired(token)` — checks `exp` claim with 30s grace period
- `extractRolesFromToken(token)` — supports MS claim URI + short `role` claim

### BFF Pattern (Backend-for-Frontend)

All auth calls go through Next.js API routes — client NEVER calls backend directly:
- `/api/auth/login` — login + set httpOnly cookie
- `/api/auth/session` — validate session
- `/api/auth/update-password` — proxies with Bearer token
- `/api/auth/forgot-password` — no auth required
- `/api/auth/reset-password` — no auth required

### Open Redirect Prevention

Login `?redirect=` param validated: `/^\/[^/]/.test(redirectTo)` blocks `//evil.com`.

## Components

### Stack: shadcn/ui + Radix UI + TailwindCSS + Lucide icons

### Menu System

- `useMenuStore` (Zustand) — persists `currentProject`, `menuMode`, `lastWorkspaceId`
- `getProjectContextMenu(workspaceSlug, projectId)` — requires BOTH args
- `getAdminMenuWithContext(role, workspaceSlug, projectId)` — transforms routes via `buildAdminUrl()`
- `transformMenuRoutes(items, ws, pid)` — strips `/admin/` prefix, rebuilds with URL builders

### Sidebar

- `AppSidebar` — main layout sidebar
- `SidebarContextPicker` — workspace/project selector (reference pattern for `getWorkspaceSlugFromProject`)
- `AdminMenu` — admin sidebar using `getAdminMenuWithContext()`
- `SidebarUserFooter` — user dropdown with role badge

### Stores

- `useAuthStore` — login/logout, BFF calls, user state
- `useMenuStore` — menu mode, project selection, role
- `useWorkspaceStore` — workspace list from `/api/proxy/workspace/me`

## References

- `references/routing-patterns.md` — Route categories, URL builder API, middleware pipeline
- `references/security-patterns.md` — JWT auth, RBAC, BFF proxy, cookie security
- `references/component-patterns.md` — Menu system, sidebar, stores, URL context usage
