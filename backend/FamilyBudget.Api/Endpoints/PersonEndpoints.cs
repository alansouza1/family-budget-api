using Family_Budget_API.Dtos.Person;
using Family_Budget_API.Services.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Family_Budget_API.Endpoints;

public static class PersonEndpoints
{
    public static RouteGroupBuilder MapPersonEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/persons")
            .WithTags("Persons");

        group.MapGet(string.Empty, GetAllAsync)
            .Produces<IEnumerable<PersonResponse>>(StatusCodes.Status200OK);

        group.MapPost(string.Empty, CreateAsync)
            .Produces<PersonResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem(StatusCodes.Status400BadRequest);

        group.MapDelete("/{id:guid}", DeleteAsync)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<Ok<IEnumerable<PersonResponse>>> GetAllAsync(IPersonService personService)
    {
        var persons = await personService.GetAllAsync();
        return TypedResults.Ok(persons);
    }

    private static async Task<Results<Created<PersonResponse>, ValidationProblem>> CreateAsync(
        CreatePersonRequest request,
        IValidator<CreatePersonRequest> validator,
        IPersonService personService)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

        var person = await personService.CreateAsync(request);
        return TypedResults.Created($"/api/persons/{person.Id}", person);
    }

    private static async Task<NoContent> DeleteAsync(Guid id, IPersonService personService)
    {
        await personService.DeleteAsync(id);
        return TypedResults.NoContent();
    }
}
