namespace Family_Budget_API.Dtos.Person;

/// <summary>
/// Data transfer object for creating a new person.
/// </summary>
public class CreatePersonRequest
{
    /// <summary>Full name of the person.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Age of the person.</summary>
    public int Age { get; set; }
}
