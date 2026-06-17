# AECIS Component Patterns Reference

## UI Stack

- **shadcn/ui** — Component library (Radix UI primitives + TailwindCSS)
- **Lucide React** — Icon library
- **TailwindCSS** — Utility-first CSS
- **Zustand** — State management (persisted stores)

## Menu System

### Menu Configuration (`src/config/menu.config.ts`)

Menus define internal routes. `transformMenuRoutes()` converts to workspace-scoped URLs at render time.

```typescript
// Menu items use INTERNAL paths
const WORKSPACE_ADMIN_MENU: MenuItem[] = [
  { id: "users", label: "Users", icon: "Users", route: "/admin/users" },
];

// Transform at render time
function transformMenuRoutes(items: MenuItem[], ws: string | null, pid: string | null): MenuItem[] {
  return items.map(item => ({
    ...item,
    route: item.route.startsWith("/admin/")
      ? buildAdminUrl(ws, pid, item.route.replace(/^\/admin\//, ""))
      : ws && pid
        ? buildProjectUrl(ws, pid, item.route.replace(/^\//, ""))
        : item.route,
  }));
}
```

### Menu Functions

```typescript
// Get project context menu — BOTH args required
getProjectContextMenu(workspaceSlug: string, projectId: string)

// Get admin menu with workspace-scoped routes
getAdminMenuWithContext(role: UserRole, workspaceSlug: string | null, projectId: string | null)

// Get project list menu (no project selected)
PROJECT_LIST_MENU  // Static array, no transform needed
```

### Menu Modes

- `"project"` — Project work (tasks, submittals, documents)
- `"admin"` — Admin panel (users, settings, billing)

Stored in `useMenuStore.menuMode`.

## Sidebar Components

### AppSidebar (`src/components/layout/AppSidebar/AppSidebar.tsx`)

Main layout sidebar. Renders different menus based on `menuMode`:
- Project mode → `SidebarContextPicker` + project menu items
- Admin mode → `AdminMenu`
- Footer → `SidebarUserFooter`

### SidebarContextPicker

Workspace/project selector dropdown. Reference pattern for deriving workspace slug:

```typescript
import { getWorkspaceSlugFromProject } from "@/lib/url-builder";

const workspaceSlug = getWorkspaceSlugFromProject({
  workspaceCode: project.workspaceCode,
  workspaceName: project.workspaceName,
});
const projectUrl = buildProjectUrl(workspaceSlug, project.id, "dashboard");
```

### AdminMenu (`src/components/layout/AppSidebar/AdminMenu.tsx`)

Uses `getAdminMenuWithContext(role, workspaceSlug, projectId)` to render role-appropriate admin menu with workspace-scoped routes.

### SidebarUserFooter

User avatar dropdown with role badge, profile link, password change, logout.

## Zustand Stores

### useAuthStore (`src/store/useAuthStore.ts`)

```typescript
const { user, login, logout, updatePassword, forgotPassword, resetPassword } = useAuthStore();
// All auth calls go through BFF (/api/auth/*) — never direct backend
```

### useMenuStore (`src/store/useMenuStore.ts`)

```typescript
const { currentProject, menuMode, userRole, setCurrentProject, setMenuMode } = useMenuStore();
// Persisted via zustand/middleware persist
// currentProject includes workspaceId, workspaceName, workspaceCode
```

### useWorkspaceStore (`src/store/useWorkspaceStore.ts`)

```typescript
const { workspaces, fetchWorkspaces } = useWorkspaceStore();
// Fetches from /api/proxy/workspace/me
```

## Navigation Patterns

### From components — use URL builders + router

```typescript
const router = useRouter();
const { workspaceSlug, projectId } = useURLContext();

// Navigate to project page
router.push(buildProjectUrl(workspaceSlug!, projectId!, "tasks"));

// Navigate to admin page
router.push(buildAdminUrl(workspaceSlug, projectId, "users"));
```

### From menu items — routes are pre-transformed

Menu items already have workspace-scoped routes after `transformMenuRoutes()`. Just use `router.push(item.route)`.

### Reserved pages (no workspace context needed)

```typescript
router.push("/profile");
router.push("/choose-project");
router.push("/login");
```
