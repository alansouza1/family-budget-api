namespace Family_Budget_API.Dtos.Summary;

/// <summary>
/// General summary containing per-person summaries and overall totals.
/// </summary>
public class GeneralSummaryResponse
{
    /// <summary>List of summaries per person.</summary>
    public List<PersonSummaryResponse> PersonSummaries { get; set; } = new();

    /// <summary>Grand total of income across all persons.</summary>
    public decimal TotalIncome { get; set; }

    /// <summary>Grand total of expenses across all persons.</summary>
    public decimal TotalExpenses { get; set; }

    /// <summary>Overall net balance (saldo líquido).</summary>
    public decimal TotalBalance { get; set; }
}
