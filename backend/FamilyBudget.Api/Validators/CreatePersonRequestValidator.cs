using Family_Budget_API.Dtos.Person;
using FluentValidation;

namespace Family_Budget_API.Validators;

/// <summary>
/// Validation rules for the CreatePersonRequest DTO.
/// All validation messages are in Portuguese for client consumption.
/// </summary>
public class CreatePersonRequestValidator : AbstractValidator<CreatePersonRequest>
{
    public CreatePersonRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(150).WithMessage("O nome deve ter no máximo 150 caracteres.");

        RuleFor(x => x.Age)
            .GreaterThan(0).WithMessage("A idade deve ser maior que zero.")
            .LessThanOrEqualTo(150).WithMessage("A idade deve ser um valor válido.");
    }
}
