using Family_Budget_API.Dtos.Summary;
using Family_Budget_API.Models;
using Family_Budget_API.Models.Enums;
using Family_Budget_API.Repositories.Interfaces;
using Family_Budget_API.Services.Interfaces;

namespace Family_Budget_API.Services;

/// <summary>
/// Implements financial summary generation.
/// Calculates per-person income/expense/balance and overall totals.
/// </summary>
public class SummaryService : ISummaryService
{
    private readonly IPersonRepository _personRepository;
    private readonly ITransactionRepository _transactionRepository;

    public SummaryService(
        IPersonRepository personRepository,
        ITransactionRepository transactionRepository)
    {
        _personRepository = personRepository;
        _transactionRepository = transactionRepository;
    }

    /// <inheritdoc />
    public async Task<GeneralSummaryResponse> GetSummaryAsync()
    {
        var persons = await _personRepository.GetAllAsync();
        var transactions = await _transactionRepository.GetAllAsync();

        // Group transactions by person to calculate individual summaries
        var transactionsByPerson = transactions
            .GroupBy(t => t.PersonId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var personSummaries = persons.Select(person =>
        {
            var personTransactions = transactionsByPerson
                .GetValueOrDefault(person.Id, new List<Transaction>());

            var totalIncome = personTransactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var totalExpenses = personTransactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount);

            return new PersonSummaryResponse
            {
                PersonId = person.Id,
                PersonName = person.Name,
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                Balance = totalIncome - totalExpenses
            };
        }).ToList();

        // Calculate overall totals across all persons
        return new GeneralSummaryResponse
        {
            PersonSummaries = personSummaries,
            TotalIncome = personSummaries.Sum(s => s.TotalIncome),
            TotalExpenses = personSummaries.Sum(s => s.TotalExpenses),
            TotalBalance = personSummaries.Sum(s => s.Balance)
        };
    }
}
