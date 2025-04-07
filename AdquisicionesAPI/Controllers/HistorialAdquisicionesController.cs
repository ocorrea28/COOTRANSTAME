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
    public class HistorialAdquisicionesController : ControllerBase
    {
        private readonly AdquisicionContext _context;

        public HistorialAdquisicionesController(AdquisicionContext context)
        {
            _context = context;
        }

        // GET: api/HistorialAdquisiciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialAdquisicion>>> GetHistorialAdquisiciones()
        {
            return await _context.HistorialAdquisiciones
                .Include(h => h.Adquisicion)
                .ToListAsync();
        }

        // GET: api/HistorialAdquisiciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HistorialAdquisicion>> GetHistorialAdquisicion(int id)
        {
            var historialAdquisicion = await _context.HistorialAdquisiciones
                .Include(h => h.Adquisicion)
                .FirstOrDefaultAsync(h => h.ID == id);

            if (historialAdquisicion == null)
            {
                return NotFound();
            }

            return historialAdquisicion;
        }

        // GET: api/HistorialAdquisiciones/ByAdquisicion/5
        [HttpGet("ByAdquisicion/{adquisicionId}")]
        public async Task<ActionResult<IEnumerable<HistorialAdquisicion>>> GetHistorialByAdquisicion(int adquisicionId)
        {
            var historial = await _context.HistorialAdquisiciones
                .Include(h => h.Adquisicion)
                .Where(h => h.AdquisicionID == adquisicionId)
                .ToListAsync();

            if (historial == null || !historial.Any())
            {
                return NotFound();
            }

            return historial;
        }

        // POST: api/HistorialAdquisiciones
        [HttpPost]
        public async Task<ActionResult<HistorialAdquisicion>> PostHistorialAdquisicion(HistorialAdquisicion historialAdquisicion)
        {
            _context.HistorialAdquisiciones.Add(historialAdquisicion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHistorialAdquisicion), new { id = historialAdquisicion.ID }, historialAdquisicion);
        }

        // PUT: api/HistorialAdquisiciones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHistorialAdquisicion(int id, HistorialAdquisicion historialAdquisicion)
        {
            if (id != historialAdquisicion.ID)
            {
                return BadRequest();
            }

            _context.Entry(historialAdquisicion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistorialAdquisicionExists(id))
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

        // DELETE: api/HistorialAdquisiciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistorialAdquisicion(int id)
        {
            var historialAdquisicion = await _context.HistorialAdquisiciones.FindAsync(id);
            if (historialAdquisicion == null)
            {
                return NotFound();
            }

            _context.HistorialAdquisiciones.Remove(historialAdquisicion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HistorialAdquisicionExists(int id)
        {
            return _context.HistorialAdquisiciones.Any(e => e.ID == id);
        }
    }
}
