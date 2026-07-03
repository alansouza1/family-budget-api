using Family_Budget_API.Dtos.Person;

namespace Family_Budget_API.Services.Interfaces;

/// <summary>
/// Defines business operations for person management.
/// </summary>
public interface IPersonService
{
    /// <summary>Returns all registered persons.</summary>
    Task<IEnumerable<PersonResponse>> GetAllAsync();

    /// <summary>Creates a new person.</summary>
    Task<PersonResponse> CreateAsync(CreatePersonRequest request);

    /// <summary>Deletes a person and all associated transactions.</summary>
    Task DeleteAsync(Guid id);
}
