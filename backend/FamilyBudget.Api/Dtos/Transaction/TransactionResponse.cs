using Family_Budget_API.Models.Enums;

namespace Family_Budget_API.Dtos.Transaction;

/// <summary>
/// Data transfer object returned when listing or creating a transaction.
/// </summary>
public class TransactionResponse
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public Guid PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;
}
