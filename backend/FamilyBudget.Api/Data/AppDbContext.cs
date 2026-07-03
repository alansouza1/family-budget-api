using Family_Budget_API.Models;
using Family_Budget_API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Family_Budget_API.Data;

/// <summary>
/// Entity Framework Core database context for the Family Budget application.
/// Configures entity mappings and relationships.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    /// <summary>Persons table.</summary>
    public DbSet<Person> Persons => Set<Person>();

    /// <summary>Transactions table.</summary>
    public DbSet<Transaction> Transactions => Set<Transaction>();

    /// <summary>
    /// Configures entity relationships and constraints using Fluent API.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Person configuration
        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(150);
            entity.Property(p => p.Age).IsRequired();
        });

        // Transaction configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Description).IsRequired().HasMaxLength(250);
            entity.Property(t => t.Amount).IsRequired().HasColumnType("decimal(18,2)");

            // Store enum as string in the database for readability
            entity.Property(t => t.Type)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<TransactionType>(v));

            // Relationship: Transaction belongs to a Person.
            // Cascade delete ensures transactions are removed when the person is deleted.
            entity.HasOne(t => t.Person)
                .WithMany(p => p.Transactions)
                .HasForeignKey(t => t.PersonId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
