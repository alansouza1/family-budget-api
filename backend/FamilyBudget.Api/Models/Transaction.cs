using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Family_Budget_API.Models.Enums;

namespace Family_Budget_API.Models;

/// <summary>
/// Represents a financial transaction (income or expense) associated with a person.
/// </summary>
public class Transaction
{
    /// <summary>Unique identifier, auto-generated.</summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>Brief description of the transaction.</summary>
    [Required]
    [MaxLength(250)]
    public string Description { get; set; } = string.Empty;

    /// <summary>Monetary value of the transaction.</summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    /// <summary>Type of transaction: Expense or Income.</summary>
    [Required]
    public TransactionType Type { get; set; }

    /// <summary>Foreign key referencing the person who owns this transaction.</summary>
    [Required]
    public Guid PersonId { get; set; }

    /// <summary>Navigation property for the associated person.</summary>
    [ForeignKey(nameof(PersonId))]
    public Person Person { get; set; } = null!;
}
