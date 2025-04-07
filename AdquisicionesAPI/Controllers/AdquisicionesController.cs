using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdquisicionesAPI.Models;
using AdquisicionesAPI.Data;
using AdquisicionesAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AdquisicionesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdquisicionesController : ControllerBase
    {
        private readonly AdquisicionContext _context;

        public AdquisicionesController(AdquisicionContext context)
        {
            _context = context;
        }

        // GET: api/Adquisiciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Adquisicion>>> GetAdquisiciones()
        {
            return await _context.Adquisiciones
                .Include(a => a.UnidadAdministrativa)
                .Include(a => a.Proveedor)
                .ToListAsync();
        }

        // GET: api/Adquisiciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Adquisicion>> GetAdquisicion(int id)
        {
            var adquisicion = await _context.Adquisiciones
                .Include(a => a.UnidadAdministrativa)
                .Include(a => a.Proveedor)
                .FirstOrDefaultAsync(a => a.ID == id);

            if (adquisicion == null)
            {
                return NotFound();
            }

            return adquisicion;
        }

        // POST: api/Adquisiciones
        [HttpPost]
        public async Task<ActionResult<Adquisicion>> PostAdquisicion(Adquisicion adquisicion)
        {
            adquisicion.FechaCreacion = DateTime.Now; // Set creation date
            _context.Adquisiciones.Add(adquisicion);
            await _context.SaveChangesAsync();

            // Create history record for the new adquisicion
            var historial = new HistorialAdquisicion
            {
                AdquisicionID = adquisicion.ID,
                Adquisicion = adquisicion,
                FechaModificacion = DateTime.Now,
                CamposModificados = "Creación de adquisición"
            };

            _context.HistorialAdquisiciones.Add(historial);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAdquisicion", new { id = adquisicion.ID }, adquisicion);
        }

        // POST: api/Adquisiciones/Simple
        // This endpoint accepts the simplified data format from the frontend using a DTO
        [HttpPost("Simple")]
        public async Task<ActionResult<Adquisicion>> PostSimpleAdquisicion([FromBody] AdquisicionDTO dto)
        {
            try
            {

                // Find the related entities
                var unidad = await _context.UnidadesAdministrativas.FindAsync(dto.UnidadID);
                var proveedor = await _context.Proveedores.FindAsync(dto.ProveedorID);

                if (unidad == null || proveedor == null)
                {
                    return BadRequest("Unidad administrativa o proveedor no encontrado");
                }

                // Create the new adquisicion from the DTO
                var adquisicion = new Adquisicion
                {
                    Presupuesto = dto.Presupuesto,
                    UnidadID = dto.UnidadID,
                    UnidadAdministrativa = unidad,
                    TipoBienServicio = dto.TipoBienServicio,
                    Cantidad = dto.Cantidad,
                    ValorUnitario = dto.ValorUnitario,
                    ValorTotal = dto.ValorTotal,
                    FechaAdquisicion = dto.FechaAdquisicion,
                    ProveedorID = dto.ProveedorID,
                    Proveedor = proveedor,
                    Documentacion = dto.Documentacion,
                    Estado = dto.Estado,
                    FechaCreacion = DateTime.Now
                };

                _context.Adquisiciones.Add(adquisicion);
                await _context.SaveChangesAsync();

                // Create history record for the new adquisicion
                var historial = new HistorialAdquisicion
                {
                    AdquisicionID = adquisicion.ID,
                    Adquisicion = adquisicion,
                    FechaModificacion = DateTime.Now,
                    CamposModificados = "Creación de adquisición"
                };

                _context.HistorialAdquisiciones.Add(historial);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAdquisicion", new { id = adquisicion.ID }, adquisicion);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al procesar la solicitud: {ex.Message}");
            }
        }

        // PUT: api/Adquisiciones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdquisicion(int id, Adquisicion adquisicion)
        {
            if (id != adquisicion.ID)
            {
                return BadRequest();
            }

            _context.Entry(adquisicion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                // Create history record
                var historial = new HistorialAdquisicion
                {
                    AdquisicionID = adquisicion.ID,
                    Adquisicion = adquisicion,
                    FechaModificacion = DateTime.Now,
                    CamposModificados = "Update operation"
                };

                _context.HistorialAdquisiciones.Add(historial);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdquisicionExists(id))
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

        // PUT: api/Adquisiciones/{id}/Simple
        // Este endpoint facilita la actualización desde el frontend con un DTO simplificado
        [HttpPut("{id}/Simple")]
        public async Task<IActionResult> PutSimpleAdquisicion(int id, AdquisicionDTO dto)
        {
            try
            {
                var adquisicion = await _context.Adquisiciones
                    .Include(a => a.UnidadAdministrativa)
                    .Include(a => a.Proveedor)
                    .FirstOrDefaultAsync(a => a.ID == id);

                if (adquisicion == null)
                {
                    return NotFound($"No se encontró la adquisición con ID {id}");
                }

                // Guarda los valores originales para el historial
                var valorOriginalPresupuesto = adquisicion.Presupuesto;
                var valorOriginalUnidadID = adquisicion.UnidadID;
                var valorOriginalUnidadNombre = adquisicion.UnidadAdministrativa?.NombreUnidad;
                var valorOriginalTipoBienServicio = adquisicion.TipoBienServicio;
                var valorOriginalCantidad = adquisicion.Cantidad;
                var valorOriginalValorUnitario = adquisicion.ValorUnitario;
                var valorOriginalValorTotal = adquisicion.ValorTotal;
                var valorOriginalFechaAdquisicion = adquisicion.FechaAdquisicion;
                var valorOriginalProveedorID = adquisicion.ProveedorID;
                var valorOriginalProveedorNombre = adquisicion.Proveedor?.NombreProveedor;
                var valorOriginalDocumentacion = adquisicion.Documentacion;
                var valorOriginalEstado = adquisicion.Estado;

                // Encuentra las entidades relacionadas
                var unidad = await _context.UnidadesAdministrativas.FindAsync(dto.UnidadID);
                var proveedor = await _context.Proveedores.FindAsync(dto.ProveedorID);

                if (unidad == null || proveedor == null)
                {
                    return BadRequest("Unidad administrativa o proveedor no encontrado");
                }

                // Actualiza los campos de la adquisición desde el DTO
                adquisicion.Presupuesto = dto.Presupuesto;
                adquisicion.UnidadID = dto.UnidadID;
                adquisicion.UnidadAdministrativa = unidad;
                adquisicion.TipoBienServicio = dto.TipoBienServicio;
                adquisicion.Cantidad = dto.Cantidad;
                adquisicion.ValorUnitario = dto.ValorUnitario;
                adquisicion.ValorTotal = dto.ValorTotal;
                adquisicion.FechaAdquisicion = dto.FechaAdquisicion;
                adquisicion.ProveedorID = dto.ProveedorID;
                adquisicion.Proveedor = proveedor;
                adquisicion.Documentacion = dto.Documentacion;
                adquisicion.Estado = dto.Estado;

                await _context.SaveChangesAsync();

                // Genera el texto con los cambios realizados
                var cambiosDetectados = new List<string>();

                if (valorOriginalPresupuesto != dto.Presupuesto)
                    cambiosDetectados.Add($"Presupuesto: {valorOriginalPresupuesto} -> {dto.Presupuesto}");
                
                if (valorOriginalUnidadID != dto.UnidadID)
                    cambiosDetectados.Add($"Unidad: {valorOriginalUnidadNombre} (ID: {valorOriginalUnidadID}) -> {unidad.NombreUnidad} (ID: {dto.UnidadID})");
                
                if (valorOriginalTipoBienServicio != dto.TipoBienServicio)
                    cambiosDetectados.Add($"Tipo de Bien/Servicio: {valorOriginalTipoBienServicio} -> {dto.TipoBienServicio}");
                
                if (valorOriginalCantidad != dto.Cantidad)
                    cambiosDetectados.Add($"Cantidad: {valorOriginalCantidad} -> {dto.Cantidad}");
                
                if (valorOriginalValorUnitario != dto.ValorUnitario)
                    cambiosDetectados.Add($"Valor Unitario: {valorOriginalValorUnitario} -> {dto.ValorUnitario}");
                
                if (valorOriginalValorTotal != dto.ValorTotal)
                    cambiosDetectados.Add($"Valor Total: {valorOriginalValorTotal} -> {dto.ValorTotal}");
                
                if (valorOriginalFechaAdquisicion != dto.FechaAdquisicion)
                    cambiosDetectados.Add($"Fecha Adquisición: {valorOriginalFechaAdquisicion:dd/MM/yyyy} -> {dto.FechaAdquisicion:dd/MM/yyyy}");
                
                if (valorOriginalProveedorID != dto.ProveedorID)
                    cambiosDetectados.Add($"Proveedor: {valorOriginalProveedorNombre} (ID: {valorOriginalProveedorID}) -> {proveedor.NombreProveedor} (ID: {dto.ProveedorID})");
                
                if (valorOriginalDocumentacion != dto.Documentacion)
                    cambiosDetectados.Add($"Documentación: {valorOriginalDocumentacion} -> {dto.Documentacion}");
                
                if (valorOriginalEstado != dto.Estado)
                    cambiosDetectados.Add($"Estado: {valorOriginalEstado} -> {dto.Estado}");

                // Texto que describe los cambios
                string camposModificadosTexto = cambiosDetectados.Count > 0 
                    ? string.Join("; ", cambiosDetectados) 
                    : "No se detectaron cambios";

                // Crea un registro de historial
                var historial = new HistorialAdquisicion
                {
                    AdquisicionID = adquisicion.ID,
                    Adquisicion = adquisicion,
                    FechaModificacion = DateTime.Now,
                    CamposModificados = camposModificadosTexto
                };

                _context.HistorialAdquisiciones.Add(historial);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al actualizar la adquisición: {ex.Message}");
            }
        }

        // DELETE: api/Adquisiciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdquisicion(int id)
        {
            var adquisicion = await _context.Adquisiciones.FindAsync(id);
            if (adquisicion == null)
            {
                return NotFound();
            }

            adquisicion.FechaDesactivacion = DateTime.Now; // Set deactivation date
            adquisicion.Estado = "Inactivo"; // Update status
            _context.Adquisiciones.Update(adquisicion); // Soft delete
            await _context.SaveChangesAsync();

            // Create history record
            var historial = new HistorialAdquisicion
            {
                AdquisicionID = adquisicion.ID,
                Adquisicion = adquisicion,
                FechaModificacion = DateTime.Now,
                CamposModificados = "Deactivation operation"
            };

            _context.HistorialAdquisiciones.Add(historial);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Adquisiciones/Filter
        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<Adquisicion>>> FilterAdquisiciones(string filter)
        {
            if (string.IsNullOrEmpty(filter))
            {
                return await _context.Adquisiciones
                    .Include(a => a.UnidadAdministrativa)
                    .Include(a => a.Proveedor)
                    .ToListAsync();
            }

            var adquisiciones = await _context.Adquisiciones
                .Include(a => a.UnidadAdministrativa)
                .Include(a => a.Proveedor)
                .Where(a => a.Presupuesto.ToString().Contains(filter) ||
                            a.UnidadAdministrativa.NombreUnidad.Contains(filter) ||
                            a.TipoBienServicio.Contains(filter) ||
                            a.Proveedor.NombreProveedor.Contains(filter) ||
                            a.Estado.Contains(filter))
                .ToListAsync();

            return adquisiciones;
        }


        private bool AdquisicionExists(int id)
        {
            return _context.Adquisiciones.Any(e => e.ID == id);
        }
    }
}