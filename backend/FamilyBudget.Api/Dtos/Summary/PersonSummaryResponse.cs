namespace Family_Budget_API.Dtos.Summary;

/// <summary>
/// Summary of income, expenses and balance for a single person.
/// </summary>
public class PersonSummaryResponse
{
    public Guid PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;

    /// <summary>Total income (receitas) for this person.</summary>
    public decimal TotalIncome { get; set; }

    /// <summary>Total expenses (despesas) for this person.</summary>
    public decimal TotalExpenses { get; set; }

    /// <summary>Net balance: income minus expenses (saldo).</summary>
    public decimal Balance { get; set; }
}
