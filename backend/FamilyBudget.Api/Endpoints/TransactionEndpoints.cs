using Family_Budget_API.Dtos.Transaction;
using Family_Budget_API.Services.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Family_Budget_API.Endpoints;

public static class TransactionEndpoints
{
    public static RouteGroupBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/transactions")
            .WithTags("Transactions");

        group.MapGet(string.Empty, GetAllAsync)
            .Produces<IEnumerable<TransactionResponse>>(StatusCodes.Status200OK);

        group.MapPost(string.Empty, CreateAsync)
            .Produces<TransactionResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<Ok<IEnumerable<TransactionResponse>>> GetAllAsync(
        ITransactionService transactionService)
    {
        var transactions = await transactionService.GetAllAsync();
        return TypedResults.Ok(transactions);
    }

    private static async Task<Results<Created<TransactionResponse>, ValidationProblem>> CreateAsync(
        CreateTransactionRequest request,
        IValidator<CreateTransactionRequest> validator,
        ITransactionService transactionService)
    {
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return TypedResults.ValidationProblem(validationResult.ToDictionary());
        }

        var transaction = await transactionService.CreateAsync(request);
        return TypedResults.Created($"/api/transactions/{transaction.Id}", transaction);
    }
}
