# EF Core Patterns

## Two DbContexts, One Database

| Context | Schema | Purpose |
|---------|--------|---------|
| `PureProjectDbContext` | business | Projects, Issues, Documents, Stakeholders |
| `ApplicationDbContext` | identity | Users, Roles, RBAC, OpenIddict |

## CLI Commands

```bash
# Required environment
export SKIP_OPENIDDICT=true
cd backend/PP.API/PP.API.Web

# Add migration
dotnet ef migrations add <Name> --context PureProjectDbContext --output-dir Migrations/Business

# Apply migration
dotnet ef database update --context PureProjectDbContext

# Remove last migration (if not applied)
dotnet ef migrations remove --context PureProjectDbContext

# Generate SQL script for review
dotnet ef migrations script --context PureProjectDbContext -o verify.sql --idempotent
```

## Migration Workflow (MANDATORY)

1. Add entity to `PP.Model.Entities`
2. Add `DbSet<Entity>` to `PureProjectDbContext`
3. Configure in `OnModelCreating` (ToTable, relationships)
4. Generate migration
5. **VERIFY migration file has CreateTable/AddColumn** (not empty!)
6. Apply migration
7. Test application
8. Commit

**FORBIDDEN:** Manual editing of `*.Designer.cs` or `*ModelSnapshot.cs`

## DbContext Configuration Pattern

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    ApplyEntityConfigurations(modelBuilder);     // ToTable, properties
    ApplyForeignKeyRelationships(modelBuilder);  // HasOne/HasMany
    ApplyGlobalQueryFilters(modelBuilder);       // Soft delete
    ApplyIndexes(modelBuilder);                  // Performance
}
```

## Entity Configuration Example

```csharp
modelBuilder.Entity<Stakeholder>(entity =>
{
    entity.ToTable("Stakeholder");
    entity.HasKey(e => e.Id);
    entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
    entity.Property(e => e.Code).HasMaxLength(50).IsRequired();

    // Soft delete filter
    entity.HasQueryFilter(e => !e.IsDeleted);

    // Index
    entity.HasIndex(e => e.WorkspaceId);
});
```

## Relationship Configuration

```csharp
// Many-to-one with navigation
modelBuilder.Entity<WorkspaceUser>()
    .HasOne(wu => wu.Workspace)
    .WithMany(w => w.WorkspaceUsers)
    .HasForeignKey(wu => wu.WorkspaceId)
    .OnDelete(DeleteBehavior.Cascade);

// Junction table (many-to-many)
modelBuilder.Entity<StakeholderProject>()
    .HasOne(sp => sp.Project)
    .WithMany(p => p.StakeholderProjects)
    .HasForeignKey(sp => sp.ProjectID);
```

## Global Query Filters (Soft Delete)

All queries auto-filter deleted records:
```csharp
modelBuilder.Entity<Project>().HasQueryFilter(e => !e.IsDeleted);
modelBuilder.Entity<Stakeholder>().HasQueryFilter(e => !e.IsDeleted);
```

Bypass for admin queries:
```csharp
var allProjects = await _context.Projects.IgnoreQueryFilters().ToListAsync();
```

## Audit Properties (BaseEntity)

```csharp
public int ID { get; set; }
public DateTime CreatedDate { get; set; }
public int? CreatedBy { get; set; }
public DateTime? ModifiedDate { get; set; }
public int? ModifiedBy { get; set; }
public bool IsDeleted { get; set; }
public DateTime? DeletedDate { get; set; }
public int? DeletedBy { get; set; }
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `SKIP_OPENIDDICT` error | Set `export SKIP_OPENIDDICT=true` |
| Empty migration | Check entity is in DbContext and OnModelCreating |
| Shadow FK `*Id1` | Use `.WithMany()` in relationship config |
| Duplicate column | Mark alias with `[NotMapped]` and `entity.Ignore()` |

## Full Documentation

See: `backend/docs/DEV/EF-CORE-GUIDE.md`
