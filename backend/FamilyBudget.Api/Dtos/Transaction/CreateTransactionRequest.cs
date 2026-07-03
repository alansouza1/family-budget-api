using Family_Budget_API.Models.Enums;

namespace Family_Budget_API.Dtos.Transaction;

/// <summary>
/// Data transfer object for creating a new transaction.
/// </summary>
public class CreateTransactionRequest
{
    /// <summary>Brief description of the transaction.</summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>Monetary value of the transaction.</summary>
    public decimal Amount { get; set; }

    /// <summary>Type of transaction: Expense (0) or Income (1).</summary>
    public TransactionType Type { get; set; }

    /// <summary>Identifier of the person associated with this transaction.</summary>
    public Guid PersonId { get; set; }
}
