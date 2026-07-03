using Family_Budget_API.Data;
using Family_Budget_API.Endpoints;
using Family_Budget_API.Middlewares;
using Family_Budget_API.Repositories;
using Family_Budget_API.Repositories.Interfaces;
using Family_Budget_API.Services;
using Family_Budget_API.Services.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Database: PostgreSQL via Entity Framework Core
// ---------------------------------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---------------------------------------------------------------------------
// Dependency Injection: Register repositories and services
// ---------------------------------------------------------------------------
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ISummaryService, SummaryService>();

// ---------------------------------------------------------------------------
// FluentValidation: validators are injected into Minimal API handlers
// ---------------------------------------------------------------------------
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// ---------------------------------------------------------------------------
// JSON serialization configuration for Minimal APIs
// ---------------------------------------------------------------------------
builder.Services.ConfigureHttpJsonOptions(options =>
{
    // Serialize enums as strings (e.g., "Expense" instead of 0)
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// ---------------------------------------------------------------------------
// OpenAPI / Swagger
// ---------------------------------------------------------------------------
builder.Services.AddOpenApi();

// ---------------------------------------------------------------------------
// CORS: allow the React frontend to call the API
// ---------------------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------------

// Global exception handling (returns standardized JSON error responses)
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.MapPersonEndpoints();
app.MapTransactionEndpoints();
app.MapSummaryEndpoints();

// ---------------------------------------------------------------------------
// Auto-apply pending EF Core migrations on startup
// ---------------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
