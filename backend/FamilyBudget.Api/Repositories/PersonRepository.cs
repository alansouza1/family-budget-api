using Family_Budget_API.Data;
using Family_Budget_API.Models;
using Family_Budget_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Family_Budget_API.Repositories;

/// <summary>
/// EF Core implementation of <see cref="IPersonRepository"/>.
/// </summary>
public class PersonRepository : IPersonRepository
{
    private readonly AppDbContext _context;

    public PersonRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.Persons
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    /// <inheritdoc />
    public async Task<Person?> GetByIdAsync(Guid id)
    {
        return await _context.Persons.FindAsync(id);
    }

    /// <inheritdoc />
    public async Task<Person> AddAsync(Person person)
    {
        _context.Persons.Add(person);
        await _context.SaveChangesAsync();
        return person;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Person person)
    {
        _context.Persons.Remove(person);
        await _context.SaveChangesAsync();
    }
}
