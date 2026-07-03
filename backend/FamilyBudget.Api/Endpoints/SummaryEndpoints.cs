using Family_Budget_API.Dtos.Summary;
using Family_Budget_API.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Family_Budget_API.Endpoints;

public static class SummaryEndpoints
{
    public static RouteGroupBuilder MapSummaryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/summary")
            .WithTags("Summary");

        group.MapGet(string.Empty, GetSummaryAsync)
            .Produces<GeneralSummaryResponse>(StatusCodes.Status200OK);

        return group;
    }

    private static async Task<Ok<GeneralSummaryResponse>> GetSummaryAsync(ISummaryService summaryService)
    {
        var summary = await summaryService.GetSummaryAsync();
        return TypedResults.Ok(summary);
    }
}
