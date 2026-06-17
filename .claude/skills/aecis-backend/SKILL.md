# AECIS Backend Development

Backend development for AECIS v2 using .NET 8, EF Core, Casbin RBAC, AutoMapper.

## When to Use

Use when:
- Adding/modifying EF entities and migrations
- Creating/updating Services and Controllers
- Implementing RBAC permissions
- Working with AutoMapper DTOs
- Querying with workspace isolation

## Quick Reference

### EF Core CLI
```bash
export SKIP_OPENIDDICT=true
cd backend/PP.API/PP.API.Web

# Business migrations
dotnet ef migrations add <Name> --context PureProjectDbContext --output-dir Migrations/Business
dotnet ef database update --context PureProjectDbContext

# Identity migrations
dotnet ef migrations add <Name> --context ApplicationDbContext --output-dir Migrations/Identity
```

**Critical:** NEVER edit `*.Designer.cs` or `*ModelSnapshot.cs` manually.

### Get Current User
```csharp
// Recommended
var userId = await _currentUser.GetBusinessUserIdAsync();  // int
var workspaceId = _currentUser.WorkspaceId;
```

### Add Permission to Endpoint
```csharp
// ALWAYS use ClaimTypes constants, never hardcode strings
using PP.API.Web.Constants;

[RequirePermission(ClaimTypes.Project.Write)]
public async Task<IActionResult> Update(...)
```

### RBAC Quick Facts
- **5 Roles:** SystemAdmin > LicenseAdmin > StakeholderAdmin > ProjectAdmin > User
- **56 Claims** across 4 scopes: Global → Workspace → Stakeholder → Project
- **3-Layer Auth:** Authentication → Tenant Isolation → Casbin Policy
- **Claim format:** `resource:action` (e.g., `project:read`, `submittal:approve`)
- **Multi-word:** Use hyphens (`manage-users`), NOT underscores
- **Constants:** `PP.API.Web.Constants.ClaimTypes.{Resource}.{Action}`
- **Casbin model:** `(user, domain, object, action)` with Redis 15-min cache

## Detailed References

Load references as needed:
- `references/ef-patterns.md` - EF Core, DbContext, migrations
- `references/rbac-patterns.md` - **Complete RBAC guide:** 3-layer auth, all 56 ClaimTypes constants, scope hierarchy, role-claim mapping, Casbin model, permission patterns
- `references/service-patterns.md` - Service layer, AutoMapper, Controllers

## File Locations

| Component | Path |
|-----------|------|
| Entities | `PP.Model/PP.Model.Entities/` |
| RBAC Entities | `PP.Model/PP.Model.Entities/RBAC/` |
| DTOs | `PP.Model/PP.Model.DTO/` |
| DbContext (Business) | `PP.DataAccess/Context/PureProjectDbContext.cs` |
| DbContext (Identity) | `PP.API.Web/Identity/Data/ApplicationDbContext.cs` |
| ClaimTypes | `PP.API.Web/Constants/ClaimTypes.cs` |
| Casbin Model | `PP.API.Web/casbin_model.conf` |
| Seed Data | `PP.API.Web/Identity/Data/DbInitializer.cs` |
| Services | `PP.Business/PP.Business.Services/` |
| Controllers | `PP.API/PP.API.Web/Controllers/` |
| AutoMapper | `PP.Business.Common/Mapping/Profiles/` |
| Auth Middleware | `PP.API.Web/Middleware/CasbinAuthorizationMiddleware.cs` |
| Docs | `backend/docs/DEV/` |
