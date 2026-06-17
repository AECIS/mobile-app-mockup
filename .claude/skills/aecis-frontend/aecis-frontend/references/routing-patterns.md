# AECIS Routing Patterns Reference

## Route Categories

| Category | Pattern | Example | Middleware Rewrite |
|----------|---------|---------|-------------------|
| `system-admin` | `/admin/*` | `/admin/workspaces` | None |
| `workspace-admin` | `/{ws}/admin/*` | `/acme/admin/users` | → `/admin/users` |
| `project-admin` | `/{ws}/admin/{pid}/*` | `/acme/admin/123/settings` | → `/admin/projects/123/settings` |
| `project-user` | `/{ws}/{pid}/*` | `/acme/123/tasks` | → `/projects/123/tasks` |
| `workspace-root` | `/{ws}` | `/acme` | → `/choose-project?workspace=acme` |
| `reserved` | `/login`, `/profile`, etc. | `/choose-project` | None |

## URL Builder API

```typescript
import { buildProjectUrl, buildAdminUrl, buildWorkspaceUrl, buildChooseProjectUrl } from "@/lib/url-builder";
import { getWorkspaceSlugFromProject, workspaceNameToSlug } from "@/lib/url-builder";

// Project URLs — ALWAYS require workspace + project
buildProjectUrl("acme", "123", "tasks")              // /acme/123/tasks
buildProjectUrl("acme", "123", "submittals/create")   // /acme/123/submittals/create
buildProjectUrl("acme", "123")                         // /acme/123

// Admin URLs — workspace null = system admin
buildAdminUrl(null, null, "workspaces")                // /admin/workspaces
buildAdminUrl("acme", null, "users")                   // /acme/admin/users
buildAdminUrl("acme", "123", "general")                // /acme/admin/123/general

// Workspace URLs
buildWorkspaceUrl("acme")                              // /acme
buildChooseProjectUrl("acme")                          // /choose-project?workspace=acme

// Derive slug from project data
getWorkspaceSlugFromProject({ workspaceCode: "acme" }) // "acme"
getWorkspaceSlugFromProject({ workspaceName: "ACME Corp" }) // "acme-corp"
```

## useURLContext Hook

Client-side source of truth — use instead of Zustand for per-tab context:

```typescript
const {
  workspaceSlug,     // string | null
  projectId,         // string | null
  category,          // RouteCategory
  isAdminRoute,      // system-admin | workspace-admin | project-admin
  isWorkspaceRoute,  // has workspace context
  isProjectRoute,    // has project context
  remainingPath,     // path after ws/pid extraction
  pathname,          // full pathname
} = useURLContext();
```

## Server-Side Context (from middleware headers)

```typescript
import { getURLContextFromHeaders } from "@/hooks/useURLContext";
import { headers } from "next/headers";

const headersList = headers();
const { workspaceSlug, projectId, category } = getURLContextFromHeaders(headersList);
```

Headers set by middleware: `x-url-workspace`, `x-url-project`, `x-url-category`.

## Reserved Paths

These are NOT treated as workspace slugs: `admin`, `api`, `_next`, `login`, `logout`, `forgot-password`, `reset-password`, `profile`, `account`, `choose-project`, `choose-workspace`, `monitoring`, `system`, `notifications`, `unauthorized`, `dashboard`, `projects`, `settings`, `calendar`, `tasks`, `reports`, `workspace`.

## parseURLPath()

```typescript
import { parseURLPath } from "@/config/route-patterns";

const result = parseURLPath("/acme/admin/123/settings");
// { category: "project-admin", workspaceSlug: "acme", projectId: "123", remainingPath: "settings" }
```

## Menu Route Transform

Menu items use internal paths (`/admin/users`). `transformMenuRoutes()` converts to workspace-scoped:

```typescript
import { getAdminMenuWithContext } from "@/config/menu.config";

// Transforms /admin/users → /acme/admin/users (workspace-admin)
// Transforms /admin/general → /acme/admin/123/general (project-admin)
const menu = getAdminMenuWithContext("LicenseAdmin", "acme", "123");
```
