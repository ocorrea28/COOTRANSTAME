using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdquisicionesAPI.Data;
using AdquisicionesAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdquisicionesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnidadesAdministrativasController : ControllerBase
    {
        private readonly AdquisicionContext _context;

        public UnidadesAdministrativasController(AdquisicionContext context)
        {
            _context = context;
        }

        // GET: api/UnidadesAdministrativas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnidadAdministrativa>>> GetUnidadesAdministrativas()
        {
            return await _context.UnidadesAdministrativas.ToListAsync();
        }

        // GET: api/UnidadesAdministrativas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UnidadAdministrativa>> GetUnidadAdministrativa(int id)
        {
            var unidadAdministrativa = await _context.UnidadesAdministrativas.FindAsync(id);

            if (unidadAdministrativa == null)
            {
                return NotFound();
            }

            return unidadAdministrativa;
        }

        // POST: api/UnidadesAdministrativas
        [HttpPost]
        public async Task<ActionResult<UnidadAdministrativa>> PostUnidadAdministrativa(UnidadAdministrativa unidadAdministrativa)
        {
            _context.UnidadesAdministrativas.Add(unidadAdministrativa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUnidadAdministrativa), new { id = unidadAdministrativa.ID }, unidadAdministrativa);
        }

        // PUT: api/UnidadesAdministrativas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnidadAdministrativa(int id, UnidadAdministrativa unidadAdministrativa)
        {
            if (id != unidadAdministrativa.ID)
            {
                return BadRequest();
            }

            _context.Entry(unidadAdministrativa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UnidadAdministrativaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/UnidadesAdministrativas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnidadAdministrativa(int id)
        {
            var unidadAdministrativa = await _context.UnidadesAdministrativas.FindAsync(id);
            if (unidadAdministrativa == null)
            {
                return NotFound();
            }

            _context.UnidadesAdministrativas.Remove(unidadAdministrativa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UnidadAdministrativaExists(int id)
        {
            return _context.UnidadesAdministrativas.Any(e => e.ID == id);
        }
    }
}
