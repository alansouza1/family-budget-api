using Family_Budget_API.Dtos.Person;
using Family_Budget_API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Family_Budget_API.Controllers;

/// <summary>
/// API controller for managing persons in the household budget system.
/// Provides endpoints for listing, creating, and deleting persons.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
    private readonly IPersonService _personService;

    public PersonsController(IPersonService personService)
    {
        _personService = personService;
    }

    /// <summary>
    /// Returns all registered persons.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PersonResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var persons = await _personService.GetAllAsync();
        return Ok(persons);
    }

    /// <summary>
    /// Creates a new person.
    /// </summary>
    /// <param name="request">Person data containing name and age.</param>
    [HttpPost]
    [ProducesResponseType(typeof(PersonResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePersonRequest request)
    {
        var person = await _personService.CreateAsync(request);
        return CreatedAtAction(nameof(GetAll), new { id = person.Id }, person);
    }

    /// <summary>
    /// Deletes a person and all associated transactions (cascade).
    /// </summary>
    /// <param name="id">Unique identifier of the person to delete.</param>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _personService.DeleteAsync(id);
        return NoContent();
    }
}
