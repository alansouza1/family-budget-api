using System.Text.Json.Serialization;

namespace Family_Budget_API.Models.Enums;

/// <summary>
/// Represents the type of a financial transaction.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TransactionType
{
    /// <summary>Expense transaction (despesa).</summary>
    Expense = 0,

    /// <summary>Income transaction (receita).</summary>
    Income = 1
}
