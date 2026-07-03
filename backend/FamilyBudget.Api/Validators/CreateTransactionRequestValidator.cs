using Family_Budget_API.Dtos.Transaction;
using FluentValidation;

namespace Family_Budget_API.Validators;

/// <summary>
/// Validation rules for the CreateTransactionRequest DTO.
/// All validation messages are in Portuguese for client consumption.
/// </summary>
public class CreateTransactionRequestValidator : AbstractValidator<CreateTransactionRequest>
{
    public CreateTransactionRequestValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(250).WithMessage("A descrição deve ter no máximo 250 caracteres.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("O valor deve ser maior que zero.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("O tipo de transação deve ser 'Expense' (despesa) ou 'Income' (receita).");

        RuleFor(x => x.PersonId)
            .NotEmpty().WithMessage("O identificador da pessoa é obrigatório.");
    }
}
