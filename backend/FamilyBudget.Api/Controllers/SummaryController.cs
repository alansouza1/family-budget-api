using Family_Budget_API.Dtos.Summary;
using Family_Budget_API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Family_Budget_API.Controllers;

/// <summary>
/// API controller for generating financial summaries.
/// Provides an endpoint that returns per-person totals and an overall summary.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SummaryController : ControllerBase
{
    private readonly ISummaryService _summaryService;

    public SummaryController(ISummaryService summaryService)
    {
        _summaryService = summaryService;
    }

    /// <summary>
    /// Returns a financial summary with per-person income, expenses, balance,
    /// and overall totals across all persons.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(GeneralSummaryResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _summaryService.GetSummaryAsync();
        return Ok(summary);
    }
}
