# Service & Controller Patterns

## AutoMapper Configuration

### Profile Structure
```
PP.Business.Common/Mapping/
├── AutoMapperProfile.cs           # Coordinator (global settings)
└── Profiles/
    ├── WorkspaceMapperProfile.cs
    ├── ProjectMapperProfile.cs
    ├── StakeholderMapperProfile.cs
    ├── DocumentDrawingMapperProfile.cs
    ├── SubmittalMapperProfile.cs
    ├── IssueTaskMapperProfile.cs
    └── UserMapperProfile.cs
```

### Three Mapping Types

```csharp
// 1. Entity ↔ DTO (bidirectional)
CreateMap<Stakeholder, StakeholderDTO>()
    .ForMember(dest => dest.StakeholderID, opt => opt.MapFrom(src => src.Id))
    .ForMember(dest => dest.StakeholderName, opt => opt.MapFrom(src => src.Name))
    .ReverseMap();

// 2. Create DTO → Entity (ignore auto-generated)
CreateMap<CreateStakeholderDTO, Stakeholder>()
    .ForMember(dest => dest.Id, opt => opt.Ignore())
    .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
    .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
    .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

// 3. Update DTO → Entity (ignore immutable)
CreateMap<UpdateStakeholderDTO, Stakeholder>()
    .ForMember(dest => dest.Id, opt => opt.Ignore())
    .ForMember(dest => dest.Code, opt => opt.Ignore())  // Can't change code
    .ForMember(dest => dest.WorkspaceId, opt => opt.Ignore());
```

### Query Projection (BEST PRACTICE)

```csharp
// ❌ SLOW: Loads all columns, maps in memory
var entities = await _context.Stakeholders.ToListAsync();
var dtos = _mapper.Map<List<StakeholderDTO>>(entities);

// ✅ FAST: Projects at SQL level
var dtos = await _context.Stakeholders
    .ProjectTo<StakeholderDTO>(_mapper.ConfigurationProvider)
    .ToListAsync();
```

## Service Layer Pattern

```csharp
public class StakeholderService : IStakeholderService
{
    private readonly PureProjectDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<StakeholderService> _logger;

    public StakeholderService(
        PureProjectDbContext context,
        IMapper mapper,
        ILogger<StakeholderService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // CREATE
    public async Task<StakeholderDTO> CreateAsync(CreateStakeholderDTO dto, int userId)
    {
        var entity = _mapper.Map<Stakeholder>(dto);
        entity.CreatedBy = userId;
        entity.CreatedDate = DateTime.UtcNow;

        _context.Stakeholders.Add(entity);
        await _context.SaveChangesAsync();

        return _mapper.Map<StakeholderDTO>(entity);
    }

    // READ (single)
    public async Task<StakeholderDTO?> GetByIdAsync(int id)
    {
        var entity = await _context.Stakeholders.FindAsync(id);
        return entity == null ? null : _mapper.Map<StakeholderDTO>(entity);
    }

    // READ (list with projection)
    public async Task<List<StakeholderDTO>> GetAllAsync(int workspaceId)
    {
        return await _context.Stakeholders
            .Where(s => s.WorkspaceId == workspaceId)
            .ProjectTo<StakeholderDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // UPDATE
    public async Task<StakeholderDTO> UpdateAsync(int id, UpdateStakeholderDTO dto, int userId)
    {
        var entity = await _context.Stakeholders.FindAsync(id)
            ?? throw new NotFoundException($"Stakeholder {id} not found");

        _mapper.Map(dto, entity);  // Map onto existing entity
        entity.ModifiedBy = userId;
        entity.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return _mapper.Map<StakeholderDTO>(entity);
    }

    // DELETE (soft)
    public async Task DeleteAsync(int id, int userId)
    {
        var entity = await _context.Stakeholders.FindAsync(id)
            ?? throw new NotFoundException($"Stakeholder {id} not found");

        entity.IsDeleted = true;
        entity.DeletedBy = userId;
        entity.DeletedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}
```

## Controller Pattern

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StakeholderController : ControllerBase
{
    private readonly IStakeholderService _service;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<StakeholderController> _logger;

    public StakeholderController(
        IStakeholderService service,
        ICurrentUserService currentUser,
        ILogger<StakeholderController> logger)
    {
        _service = service;
        _currentUser = currentUser;
        _logger = logger;
    }

    [HttpGet]
    [RequirePermission("stakeholder:read")]
    public async Task<IActionResult> GetAll()
    {
        var workspaceId = _currentUser.WorkspaceId;
        var result = await _service.GetAllAsync(workspaceId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [RequirePermission("stakeholder:read")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [RequirePermission("stakeholder:write")]
    public async Task<IActionResult> Create([FromBody] CreateStakeholderDTO dto)
    {
        var userId = await _currentUser.GetBusinessUserIdAsync();
        var result = await _service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.StakeholderID }, result);
    }

    [HttpPut("{id}")]
    [RequirePermission("stakeholder:write")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateStakeholderDTO dto)
    {
        var userId = await _currentUser.GetBusinessUserIdAsync();
        var result = await _service.UpdateAsync(id, dto, userId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [RequirePermission("stakeholder:delete")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = await _currentUser.GetBusinessUserIdAsync();
        await _service.DeleteAsync(id, userId);
        return NoContent();
    }
}
```

## DTO Naming Convention

| Pattern | Purpose | Example |
|---------|---------|---------|
| `{Entity}DTO` | Read/Response | `StakeholderDTO` |
| `Create{Entity}DTO` | Create request | `CreateStakeholderDTO` |
| `Update{Entity}DTO` | Update request | `UpdateStakeholderDTO` |
| `{Entity}StatsDTO` | Aggregates | `WorkspaceStatsDTO` |
| `{Entity}ViewModel` | Frontend | `UserViewModel` |

## Service Registration

```csharp
// Program.cs
builder.Services.AddScoped<IStakeholderService, StakeholderService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);
```

## Error Handling

```csharp
// Custom exception
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

// In controller (handled by middleware)
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    try
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }
    catch (NotFoundException ex)
    {
        return NotFound(new { error = ex.Message });
    }
}
```

## Full Documentation

See: `backend/docs/DEV/EF-CORE-GUIDE.md` (Part 5: AutoMapper, Service patterns)
