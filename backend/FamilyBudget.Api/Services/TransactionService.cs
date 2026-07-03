using Family_Budget_API.Dtos.Transaction;
using Family_Budget_API.Models;
using Family_Budget_API.Models.Enums;
using Family_Budget_API.Repositories.Interfaces;
using Family_Budget_API.Services.Interfaces;

namespace Family_Budget_API.Services;

/// <summary>
/// Implements business logic for transaction management.
/// Enforces the rule that minors (age &lt; 18) can only register expenses.
/// </summary>
public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IPersonRepository _personRepository;
    private readonly ILogger<TransactionService> _logger;

    /// <summary>Minimum age required to register income transactions.</summary>
    private const int LegalAge = 18;

    public TransactionService(
        ITransactionRepository transactionRepository,
        IPersonRepository personRepository,
        ILogger<TransactionService> logger)
    {
        _transactionRepository = transactionRepository;
        _personRepository = personRepository;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<TransactionResponse>> GetAllAsync()
    {
        var transactions = await _transactionRepository.GetAllAsync();

        return transactions.Select(t => new TransactionResponse
        {
            Id = t.Id,
            Description = t.Description,
            Amount = t.Amount,
            Type = t.Type,
            PersonId = t.PersonId,
            PersonName = t.Person.Name
        });
    }

    /// <inheritdoc />
    public async Task<TransactionResponse> CreateAsync(CreateTransactionRequest request)
    {
        // Validate that the referenced person exists
        var person = await _personRepository.GetByIdAsync(request.PersonId);

        if (person is null)
        {
            throw new KeyNotFoundException(
                $"Pessoa com o identificador '{request.PersonId}' não foi encontrada.");
        }

        // Business rule: minors (under 18) can only register expenses
        if (person.Age < LegalAge && request.Type == TransactionType.Income)
        {
            throw new InvalidOperationException(
                "Menores de idade (abaixo de 18 anos) só podem cadastrar despesas.");
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Description = request.Description,
            Amount = request.Amount,
            Type = request.Type,
            PersonId = request.PersonId
        };

        var created = await _transactionRepository.AddAsync(transaction);
        _logger.LogInformation(
            "Transaction created: {TransactionId} for Person {PersonId}",
            created.Id, created.PersonId);

        return new TransactionResponse
        {
            Id = created.Id,
            Description = created.Description,
            Amount = created.Amount,
            Type = created.Type,
            PersonId = created.PersonId,
            PersonName = person.Name
        };
    }
}
