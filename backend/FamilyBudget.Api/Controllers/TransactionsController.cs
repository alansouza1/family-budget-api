using Family_Budget_API.Dtos.Transaction;
using Family_Budget_API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Family_Budget_API.Controllers;

/// <summary>
/// API controller for managing financial transactions.
/// Provides endpoints for listing and creating transactions.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    /// <summary>
    /// Returns all registered transactions with associated person information.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TransactionResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _transactionService.GetAllAsync();
        return Ok(transactions);
    }

    /// <summary>
    /// Creates a new transaction.
    /// Business rule: minors (under 18) can only register expense transactions.
    /// </summary>
    /// <param name="request">Transaction data including description, amount, type, and person ID.</param>
    [HttpPost]
    [ProducesResponseType(typeof(TransactionResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create([FromBody] CreateTransactionRequest request)
    {
        var transaction = await _transactionService.CreateAsync(request);
        return CreatedAtAction(nameof(GetAll), new { id = transaction.Id }, transaction);
    }
}
