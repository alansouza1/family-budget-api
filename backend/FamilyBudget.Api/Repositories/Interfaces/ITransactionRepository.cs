using Family_Budget_API.Models;

namespace Family_Budget_API.Repositories.Interfaces;

/// <summary>
/// Defines data-access operations for the Transaction entity.
/// </summary>
public interface ITransactionRepository
{
    /// <summary>Returns all transactions including the associated person.</summary>
    Task<IEnumerable<Transaction>> GetAllAsync();

    /// <summary>Adds a new transaction to the database.</summary>
    Task<Transaction> AddAsync(Transaction transaction);
}
