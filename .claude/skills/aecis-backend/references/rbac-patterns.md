# RBAC & Authorization Patterns

## Dual User System

| User Type | ID | Schema | Purpose |
|-----------|-----|--------|---------|
| Identity User | GUID | identity | Authentication, JWT |
| Business User | int | business | FK relationships, domain logic |

Linked via `UserDTO.IdentityUserId` (GUID string).

## Authorization: 3-Layer Security

```
Request → JWT Token → [Authorize] → CasbinAuthorizationFilter
                                          │
                         Layer 1: Authentication (valid userId in JWT?)
                         Layer 2: Tenant Isolation (X-Workspace-ID matches JWT?)
                         Layer 3: Casbin Policy (user has permission in domain?)
                                          │
                                     Allow / Deny
```

- SystemAdmin bypasses Layer 2 (tenant isolation)
- Header overrides: `X-Workspace-ID`, `X-Project-ID`, `X-Stakeholder-ID`
- Redis cache: 15-min TTL on Casbin policy evaluation

## Scope Hierarchy

```
Global
  └── Workspace (tenant boundary)
        └── Stakeholder (organization within workspace)
              └── Project (individual project)
```

**4 Scopes** seeded in DB: global, workspace, stakeholder, project

## Role Hierarchy (5 roles)

| Role | Scope | Level | Access |
|------|-------|-------|--------|
| **SystemAdmin** | Global | 0 | ALL claims (56), bypasses tenant isolation |
| **LicenseAdmin** | Workspace | 1 | Workspace + Stakeholder + Project claims |
| **StakeholderAdmin** | Stakeholder | 2 | Stakeholder + Project claims |
| **ProjectAdmin** | Project | 3 | All project-level claims |
| **User** | Project | 4 | Read-only + comment:write + timetracking:write |

## ClaimTypes Constants (use these in code)

**IMPORTANT:** Always use `ClaimTypes.*` constants from `PP.API.Web.Constants.ClaimTypes`, never hardcode strings.

### ClaimTypes.Scopes (used by DbInitializer seeding)

```csharp
// Global scope
ClaimTypes.Scopes.SystemManage       // "system:manage"
ClaimTypes.Scopes.WorkspaceCreate    // "workspace:create"
ClaimTypes.Scopes.WorkspaceDelete    // "workspace:delete"

// Workspace scope
ClaimTypes.Scopes.WorkspaceManage    // "workspace:manage"
ClaimTypes.Scopes.UserInvite         // "user:invite"
ClaimTypes.Scopes.UserRemove         // "user:remove"
ClaimTypes.Scopes.StakeholderCreate  // "stakeholder:create"
ClaimTypes.Scopes.StakeholderDelete  // "stakeholder:delete"

// Stakeholder scope
ClaimTypes.Scopes.StakeholderManage  // "stakeholder:manage"
ClaimTypes.Scopes.ProjectCreate      // "project:create"
ClaimTypes.Scopes.ProjectDelete      // "project:delete"

// Project scope
ClaimTypes.Scopes.ProjectManage      // "project:manage"
ClaimTypes.Scopes.ProjectRead        // "project:read"
ClaimTypes.Scopes.DocumentCreate     // "document:create"
ClaimTypes.Scopes.DocumentEdit       // "document:edit"
ClaimTypes.Scopes.DocumentDelete     // "document:delete"
ClaimTypes.Scopes.TaskCreate         // "task:create"
ClaimTypes.Scopes.TaskEdit           // "task:edit"
ClaimTypes.Scopes.TaskDelete         // "task:delete"
```

### ClaimTypes.{Resource} (used in [RequirePermission])

```csharp
// Workspace (5)
ClaimTypes.Workspace.Read            // "workspace:read"
ClaimTypes.Workspace.Write           // "workspace:write"
ClaimTypes.Workspace.Delete          // "workspace:delete"
ClaimTypes.Workspace.ManageUsers     // "workspace:manage-users"
ClaimTypes.Workspace.ManageRoles     // "workspace:manage-roles"

// User (4)
ClaimTypes.User.Read                 // "user:read"
ClaimTypes.User.Write                // "user:write"
ClaimTypes.User.Delete               // "user:delete"
ClaimTypes.User.ManageRoles          // "user:manage-roles"

// Stakeholder (5)
ClaimTypes.Stakeholder.Read          // "stakeholder:read"
ClaimTypes.Stakeholder.Write         // "stakeholder:write"
ClaimTypes.Stakeholder.Delete        // "stakeholder:delete"
ClaimTypes.Stakeholder.ManageUsers   // "stakeholder:manage-users"
ClaimTypes.Stakeholder.ManageProjects// "stakeholder:manage-projects"

// Project (5)
ClaimTypes.Project.Read              // "project:read"
ClaimTypes.Project.Write             // "project:write"
ClaimTypes.Project.Delete            // "project:delete"
ClaimTypes.Project.ManageUsers       // "project:manage-users"
ClaimTypes.Project.ManageTasks       // "project:manage-tasks"

// Document (4)
ClaimTypes.Document.Read             // "document:read"
ClaimTypes.Document.Write            // "document:write"
ClaimTypes.Document.Delete           // "document:delete"
ClaimTypes.Document.ManagePermissions// "document:manage-permissions"

// Task (4)
ClaimTypes.Task.Read                 // "task:read"
ClaimTypes.Task.Write                // "task:write"
ClaimTypes.Task.Delete               // "task:delete"
ClaimTypes.Task.Assign               // "task:assign"

// Comment (3)
ClaimTypes.Comment.Read              // "comment:read"
ClaimTypes.Comment.Write             // "comment:write"
ClaimTypes.Comment.Delete            // "comment:delete"

// Workflow (2)
ClaimTypes.Workflow.Read             // "workflow:read"
ClaimTypes.Workflow.Write            // "workflow:write"

// TimeTracking (4)
ClaimTypes.TimeTracking.Read         // "timetracking:read"
ClaimTypes.TimeTracking.Write        // "timetracking:write"
ClaimTypes.TimeTracking.Delete       // "timetracking:delete"
ClaimTypes.TimeTracking.Approve      // "timetracking:approve"

// Settings (2)
ClaimTypes.Settings.Read             // "settings:read"
ClaimTypes.Settings.Write            // "settings:write"

// Activity (3)
ClaimTypes.Activity.Read             // "activity:read"
ClaimTypes.Activity.Write            // "activity:write"
ClaimTypes.Activity.Delete           // "activity:delete"

// Distribution (6)
ClaimTypes.Distribution.Read         // "distribution:read"
ClaimTypes.Distribution.Write        // "distribution:write"
ClaimTypes.Distribution.Delete       // "distribution:delete"
ClaimTypes.Distribution.Send         // "distribution:send"
ClaimTypes.Distribution.Respond      // "distribution:respond"
ClaimTypes.Distribution.Track        // "distribution:track"

// Submittal (9)
ClaimTypes.Submittal.Read            // "submittal:read"
ClaimTypes.Submittal.Write           // "submittal:write"
ClaimTypes.Submittal.Delete          // "submittal:delete"
ClaimTypes.Submittal.Submit          // "submittal:submit"
ClaimTypes.Submittal.Approve         // "submittal:approve"
ClaimTypes.Submittal.Reject          // "submittal:reject"
ClaimTypes.Submittal.Revise          // "submittal:revise"
ClaimTypes.Submittal.CreateRevision  // "submittal:create-revision"
ClaimTypes.Submittal.Export          // "submittal:export"
```

## Get Current User

```csharp
// Option 1: ICurrentUserService (recommended)
private readonly ICurrentUserService _currentUser;

var userId = await _currentUser.GetBusinessUserIdAsync();  // int
var workspaceId = _currentUser.WorkspaceId;  // int
var claims = _currentUser.Claims;

// Option 2: ClaimsPrincipal extensions
var userId = await User.GetBusinessUserIdAsync(_context);
var workspaceId = User.GetWorkspaceId();
```

## Add Permission to Endpoint

```csharp
[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectController : ControllerBase
{
    [HttpGet]
    [RequirePermission(ClaimTypes.Project.Read)]
    public async Task<IActionResult> GetAll() { }

    [HttpPost]
    [RequirePermission(ClaimTypes.Project.Write)]
    public async Task<IActionResult> Create([FromBody] CreateProjectDTO dto) { }

    [HttpDelete("{id}")]
    [RequirePermission(ClaimTypes.Project.Delete)]
    public async Task<IActionResult> Delete(int id) { }
}
```

## Add New Permission (3 Steps)

1. **Add constant** to `ClaimTypes.cs`:
```csharp
public static class NewResource
{
    public const string Read = "newresource:read";
    public const string Write = "newresource:write";
}
```

2. **Seed claim + role mapping** in `DbInitializer` or `RbacSeedService`:
```csharp
new Claim { ScopeId = projectScope.Id, Name = ClaimTypes.NewResource.Read, ... }
new RoleClaim { RoleId = projectAdminRoleId, ClaimId = newClaimId }
```

3. **Use in controller**:
```csharp
[RequirePermission(ClaimTypes.NewResource.Read)]
public async Task<IActionResult> GetAll() { }
```

## Casbin Model

```
r = sub, dom, obj, act        # user, workspace-domain, resource, action
p = sub, dom, obj, act        # role, domain, resource, action
g = _, _, _                    # user → role in domain
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act
```

## Claim Naming Convention

- Format: `resource:action` (e.g., `project:read`, `submittal:approve`)
- Use hyphens for multi-word: `manage-users`, `manage-roles`, `create-revision`
- NOT underscores: ~~`manage_users`~~

## Workspace Isolation

JWT contains `workspace_id` claim. All queries auto-filtered:
```csharp
var projects = await _context.Projects.ToListAsync();  // Only current workspace
```

## DB Migrations

```bash
export SKIP_OPENIDDICT=true
cd backend/PP.API/PP.API.Web

# Business schema (entities, soft delete)
dotnet ef migrations add <Name> --context PureProjectDbContext --output-dir Migrations/Business

# Identity schema (RBAC tables, users)
dotnet ef migrations add <Name> --context ApplicationDbContext --output-dir Migrations/Identity
```

**NEVER** edit `*.Designer.cs` or `*ModelSnapshot.cs` manually.

## Key Files

| File | Purpose |
|------|---------|
| `PP.API.Web/Constants/ClaimTypes.cs` | All 56 claim constants |
| `PP.API.Web/casbin_model.conf` | Casbin RBAC model definition |
| `PP.API.Web/Identity/Data/DbInitializer.cs` | Seeds scopes, roles, claims, admin user |
| `PP.API.Web/Identity/Data/ApplicationDbContext.cs` | Identity + RBAC DbContext |
| `PP.API.Web/Middleware/CasbinAuthorizationMiddleware.cs` | 3-layer auth filter |
| `PP.Infrastructure.Auth/Attributes/RequirePermissionAttribute.cs` | Permission attribute |
| `PP.Infrastructure.Auth/Services/PermissionService.cs` | Permission checks + cache |
| `PP.Model.Entities/RBAC/` | Role, Scope, Claim, RoleClaim, UserRole entities |
| `backend/docs/DEV/RBAC-GUIDE.md` | Full RBAC documentation |

## Known Gaps

- DbInitializer seeds 19 claims (via `ClaimTypes.Scopes.*`), but ClaimTypes.cs defines 56
- Activity/Distribution/Submittal claims may need separate seeding
- ~10 controllers still missing `[RequirePermission]` attributes
- `ClaimTypes.Scopes.*` uses different naming than `ClaimTypes.{Resource}.*` for some claims
