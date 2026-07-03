using Family_Budget_API.Models;

namespace Family_Budget_API.Repositories.Interfaces;

/// <summary>
/// Defines data-access operations for the Person entity.
/// </summary>
public interface IPersonRepository
{
    /// <summary>Returns all persons.</summary>
    Task<IEnumerable<Person>> GetAllAsync();

    /// <summary>Returns a person by its unique identifier, or null if not found.</summary>
    Task<Person?> GetByIdAsync(Guid id);

    /// <summary>Adds a new person to the database.</summary>
    Task<Person> AddAsync(Person person);

    /// <summary>Deletes a person and cascades to its transactions.</summary>
    Task DeleteAsync(Person person);
}
