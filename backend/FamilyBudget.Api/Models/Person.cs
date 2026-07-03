using System.ComponentModel.DataAnnotations;

namespace Family_Budget_API.Models;

/// <summary>
/// Represents a person in the household budget system.
/// Each person can have multiple associated transactions.
/// </summary>
public class Person
{
    /// <summary>Unique identifier, auto-generated.</summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>Full name of the person.</summary>
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>Age of the person. Used to enforce business rules (e.g., minors cannot register income).</summary>
    [Required]
    public int Age { get; set; }

    /// <summary>Navigation property for related transactions.</summary>
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
