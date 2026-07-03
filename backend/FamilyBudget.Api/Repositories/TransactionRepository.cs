using Family_Budget_API.Data;
using Family_Budget_API.Models;
using Family_Budget_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Family_Budget_API.Repositories;

/// <summary>
/// EF Core implementation of <see cref="ITransactionRepository"/>.
/// </summary>
public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _context;

    public TransactionRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<Transaction>> GetAllAsync()
    {
        return await _context.Transactions
            .AsNoTracking()
            .Include(t => t.Person)
            .OrderBy(t => t.Description)
            .ToListAsync();
    }

    /// <inheritdoc />
    public async Task<Transaction> AddAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }
}
