# AECIS Security Patterns Reference

## Middleware Auth Pipeline

Located in `src/middleware.ts`. Runs on every non-static request.

### Step-by-step flow

1. **Skip static/API routes** — `/_next`, `/api`, files with extensions
2. **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP
3. **JWT validation** — Read `auth_token` httpOnly cookie, check expiry via `isTokenExpired()`
4. **Protected route guard** — If not public route AND no valid token → redirect `/login?redirect={path}`
5. **Auth route redirect** — If on auth route AND has valid token → redirect `/choose-project`
6. **RBAC: System admin** — `/admin/*` requires `SystemAdmin` role → else `/unauthorized`
7. **Legacy URL redirects** — `/workspace/*` → workspace-scoped equivalents
8. **URL rewrite** — `matchAndRewriteURL()` rewrites workspace paths to internal paths
9. **RBAC: Admin categories** — `workspace-admin`/`project-admin` require admin roles
10. **Workspace validation** — URL workspace vs `aecis-workspace` cookie (SystemAdmin bypasses)
11. **Context headers** — Set `x-url-workspace`, `x-url-project`, `x-url-category`

## JWT Edge Runtime

File: `src/lib/jwt-edge.ts` — Edge Runtime compatible (no Node.js crypto).

```typescript
import { decodeJWTPayload, isTokenExpired, extractRolesFromToken } from "@/lib/jwt-edge";

decodeJWTPayload(token)      // JWTPayload | null (base64 decode only)
isTokenExpired(token)         // true if expired (30s grace for clock skew)
extractRolesFromToken(token)  // string[] — supports MS claim URI + "role"
```

**No signature verification** — Edge Runtime limitation. Backend validates via Casbin.

## Roles

| Role | Access Level |
|------|-------------|
| `SystemAdmin` | All routes including `/admin/*` |
| `LicenseAdmin` | Workspace admin routes |
| `StakeholderAdmin` | Organization admin routes |
| `ProjectAdmin` | Project admin routes |
| `User` | Project user routes only |

RBAC in middleware = defense-in-depth. Backend Casbin is authoritative.

## BFF (Backend-for-Frontend) Pattern

Client NEVER calls backend directly. All requests proxy through Next.js API routes.

### Auth BFF Routes

| Route | Auth Required | Purpose |
|-------|--------------|---------|
| `POST /api/auth/login` | No | Login, sets httpOnly cookie |
| `GET /api/auth/session` | Yes (cookie) | Validate session, return user |
| `POST /api/auth/logout` | Yes (cookie) | Clear cookie |
| `POST /api/auth/update-password` | Yes (cookie) | Proxy with Bearer token |
| `POST /api/auth/forgot-password` | No | Forward email to backend |
| `POST /api/auth/reset-password` | No | Forward token+password to backend |

### BFF Route Pattern

```typescript
// src/app/api/auth/update-password/route.ts
import { getAccessToken } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const res = await fetch(`${API_URL}/api/auth/update-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  // Forward response to client
}
```

## Cookie Security

| Cookie | Purpose | HttpOnly | Secure |
|--------|---------|----------|--------|
| `auth_token` | JWT access token | Yes | Yes (prod) |
| `aecis-workspace` | Current workspace slug | No | Yes (prod) |

Token NEVER exposed to client JavaScript — only accessible server-side.

## Open Redirect Prevention

Login page reads `?redirect=` param. Validated with:

```typescript
if (redirectTo && /^\/[^/]/.test(redirectTo)) {
  router.push(redirectTo);  // Safe: starts with / followed by non-/
} else {
  router.push("/choose-project");  // Fallback
}
```

Blocks `//evil.com` (protocol-relative URLs) and absolute URLs.

## Path Security

- Max path length: 512 chars (prevents ReDoS)
- Max segment length: 128 chars
- Workspace slug validation: `/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/`
