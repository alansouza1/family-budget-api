using Family_Budget_API.Dtos.Summary;

namespace Family_Budget_API.Services.Interfaces;

/// <summary>
/// Defines operations for generating financial summaries.
/// </summary>
public interface ISummaryService
{
    /// <summary>
    /// Generates a complete summary with per-person totals and a general overall total.
    /// </summary>
    Task<GeneralSummaryResponse> GetSummaryAsync();
}
