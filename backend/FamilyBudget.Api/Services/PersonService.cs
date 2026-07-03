using Family_Budget_API.Dtos.Person;
using Family_Budget_API.Models;
using Family_Budget_API.Repositories.Interfaces;
using Family_Budget_API.Services.Interfaces;

namespace Family_Budget_API.Services;

/// <summary>
/// Implements business logic for person management.
/// Handles creation, listing, and deletion (with cascade to transactions via EF Core).
/// </summary>
public class PersonService : IPersonService
{
    private readonly IPersonRepository _personRepository;
    private readonly ILogger<PersonService> _logger;

    public PersonService(IPersonRepository personRepository, ILogger<PersonService> logger)
    {
        _personRepository = personRepository;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<PersonResponse>> GetAllAsync()
    {
        var persons = await _personRepository.GetAllAsync();

        return persons.Select(p => new PersonResponse
        {
            Id = p.Id,
            Name = p.Name,
            Age = p.Age
        });
    }

    /// <inheritdoc />
    public async Task<PersonResponse> CreateAsync(CreatePersonRequest request)
    {
        var person = new Person
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Age = request.Age
        };

        var created = await _personRepository.AddAsync(person);
        _logger.LogInformation("Person created: {PersonId} - {PersonName}", created.Id, created.Name);

        return new PersonResponse
        {
            Id = created.Id,
            Name = created.Name,
            Age = created.Age
        };
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id)
    {
        var person = await _personRepository.GetByIdAsync(id);

        if (person is null)
        {
            throw new KeyNotFoundException($"Pessoa com o identificador '{id}' não foi encontrada.");
        }

        await _personRepository.DeleteAsync(person);
        _logger.LogInformation("Person deleted: {PersonId} - {PersonName}", person.Id, person.Name);
    }
}
