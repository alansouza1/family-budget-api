using Family_Budget_API.Dtos.Transaction;

namespace Family_Budget_API.Services.Interfaces;

/// <summary>
/// Defines business operations for transaction management.
/// </summary>
public interface ITransactionService
{
    /// <summary>Returns all registered transactions.</summary>
    Task<IEnumerable<TransactionResponse>> GetAllAsync();

    /// <summary>Creates a new transaction, enforcing business rules.</summary>
    Task<TransactionResponse> CreateAsync(CreateTransactionRequest request);
}
