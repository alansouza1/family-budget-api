namespace Family_Budget_API.Dtos.Person;

/// <summary>
/// Data transfer object returned when listing or creating a person.
/// </summary>
public class PersonResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}
