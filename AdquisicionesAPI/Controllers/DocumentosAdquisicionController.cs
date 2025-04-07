using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdquisicionesAPI.Data;
using AdquisicionesAPI.Models;
using AdquisicionesAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdquisicionesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentosAdquisicionController : ControllerBase
    {
        private readonly AdquisicionContext _context;

        public DocumentosAdquisicionController(AdquisicionContext context)
        {
            _context = context;
        }

        // GET: api/DocumentosAdquisicion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentoAdquisicion>>> GetDocumentosAdquisicion()
        {
            return await _context.DocumentosAdquisicion
                .Include(d => d.Adquisicion)
                .ToListAsync();
        }

        // GET: api/DocumentosAdquisicion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentoAdquisicion>> GetDocumentoAdquisicion(int id)
        {
            var documentoAdquisicion = await _context.DocumentosAdquisicion
                .Include(d => d.Adquisicion)
                .FirstOrDefaultAsync(d => d.ID == id);

            if (documentoAdquisicion == null)
            {
                return NotFound();
            }

            return documentoAdquisicion;
        }

        // GET: api/DocumentosAdquisicion/ByAdquisicion/5
        [HttpGet("ByAdquisicion/{adquisicionId}")]
        public async Task<ActionResult<IEnumerable<DocumentoAdquisicion>>> GetDocumentosByAdquisicion(int adquisicionId)
        {
            var documentos = await _context.DocumentosAdquisicion
                .Include(d => d.Adquisicion)
                .Where(d => d.AdquisicionID == adquisicionId)
                .ToListAsync();

            if (documentos == null || !documentos.Any())
            {
                return NotFound();
            }

            return documentos;
        }

        // POST: api/DocumentosAdquisicion
        [HttpPost]
        public async Task<ActionResult<DocumentoAdquisicion>> PostDocumentoAdquisicion(DocumentoAdquisicion documentoAdquisicion)
        {
            // Add the document
            _context.DocumentosAdquisicion.Add(documentoAdquisicion);
            await _context.SaveChangesAsync();
            
            // Create history record for the document addition
            var adquisicion = await _context.Adquisiciones.FindAsync(documentoAdquisicion.AdquisicionID);
            if (adquisicion == null)
            {
                // Log the error but continue - we don't want to fail the document operation if history fails
                Console.Error.WriteLine($"Error: No se encontró la adquisición con ID {documentoAdquisicion.AdquisicionID} para crear historial");
                return CreatedAtAction(nameof(GetDocumentoAdquisicion), new { id = documentoAdquisicion.ID }, documentoAdquisicion);
            }
            
            var historial = new HistorialAdquisicion
            {
                AdquisicionID = documentoAdquisicion.AdquisicionID,
                Adquisicion = adquisicion,
                FechaModificacion = DateTime.Now,
                CamposModificados = $"Se agregó documento: {documentoAdquisicion.TipoDocumento} {documentoAdquisicion.NumeroDocumento}"
            };
            
            _context.HistorialAdquisiciones.Add(historial);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocumentoAdquisicion), new { id = documentoAdquisicion.ID }, documentoAdquisicion);
        }
        
        // POST: api/DocumentosAdquisicion/Simple
        // This endpoint accepts the simplified data format from the frontend using a DTO
        [HttpPost("Simple")]
        public async Task<ActionResult<DocumentoAdquisicion>> PostSimpleDocumentoAdquisicion([FromBody] DocumentoAdquisicionDTO dto)
        {
            try
            {
                // Find the related adquisicion
                var adquisicion = await _context.Adquisiciones.FindAsync(dto.AdquisicionID);
                
                if (adquisicion == null)
                {
                    return BadRequest("Adquisición no encontrada");
                }
                
                // Create the new documento from the DTO
                var documentoAdquisicion = new DocumentoAdquisicion
                {
                    AdquisicionID = dto.AdquisicionID,
                    Adquisicion = adquisicion,
                    TipoDocumento = dto.TipoDocumento,
                    NumeroDocumento = dto.NumeroDocumento,
                    FechaDocumento = dto.FechaDocumento,
                    Archivo = dto.Archivo
                };
                
                _context.DocumentosAdquisicion.Add(documentoAdquisicion);
                await _context.SaveChangesAsync();
                
                // Create history record for the document addition
                // We already have the adquisicion object from earlier in the method
                var historial = new HistorialAdquisicion
                {
                    AdquisicionID = dto.AdquisicionID,
                    Adquisicion = adquisicion,
                    FechaModificacion = DateTime.Now,
                    CamposModificados = $"Se agregó documento: {dto.TipoDocumento} {dto.NumeroDocumento}"
                };
                
                _context.HistorialAdquisiciones.Add(historial);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetDocumentoAdquisicion), new { id = documentoAdquisicion.ID }, documentoAdquisicion);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al procesar la solicitud: {ex.Message}");
            }
        }

        // PUT: api/DocumentosAdquisicion/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocumentoAdquisicion(int id, DocumentoAdquisicion documentoAdquisicion)
        {
            if (id != documentoAdquisicion.ID)
            {
                return BadRequest();
            }

            _context.Entry(documentoAdquisicion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                
                // Create history record for the document update
                var adquisicion = await _context.Adquisiciones.FindAsync(documentoAdquisicion.AdquisicionID);
                if (adquisicion == null)
                {
                    // Log the error but continue - don't fail the update if just the history fails
                    Console.Error.WriteLine($"Error: No se encontró la adquisición con ID {documentoAdquisicion.AdquisicionID} para crear historial");
                    return NoContent();
                }
                
                var historial = new HistorialAdquisicion
                {
                    AdquisicionID = documentoAdquisicion.AdquisicionID,
                    Adquisicion = adquisicion,
                    FechaModificacion = DateTime.Now,
                    CamposModificados = $"Se actualizó documento: {documentoAdquisicion.TipoDocumento} {documentoAdquisicion.NumeroDocumento}"
                };
                
                _context.HistorialAdquisiciones.Add(historial);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentoAdquisicionExists(id))
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

        // DELETE: api/DocumentosAdquisicion/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocumentoAdquisicion(int id)
        {
            var documentoAdquisicion = await _context.DocumentosAdquisicion.FindAsync(id);
            if (documentoAdquisicion == null)
            {
                return NotFound();
            }
            
            // Store info before deletion for history record
            int adquisicionId = documentoAdquisicion.AdquisicionID;
            string tipoDocumento = documentoAdquisicion.TipoDocumento;
            string numeroDocumento = documentoAdquisicion.NumeroDocumento;

            _context.DocumentosAdquisicion.Remove(documentoAdquisicion);
            await _context.SaveChangesAsync();
            
            // Create history record for the document deletion
            var adquisicion = await _context.Adquisiciones.FindAsync(adquisicionId);
            if (adquisicion == null)
            {
                // Log the error but continue - don't fail the delete if just the history fails
                Console.Error.WriteLine($"Error: No se encontró la adquisición con ID {adquisicionId} para crear historial");
                return NoContent();
            }
            
            var historial = new HistorialAdquisicion
            {
                AdquisicionID = adquisicionId,
                Adquisicion = adquisicion,
                FechaModificacion = DateTime.Now,
                CamposModificados = $"Se eliminó documento: {tipoDocumento} {numeroDocumento}"
            };
            
            _context.HistorialAdquisiciones.Add(historial);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentoAdquisicionExists(int id)
        {
            return _context.DocumentosAdquisicion.Any(e => e.ID == id);
        }
        
        // PUT: api/DocumentosAdquisicion/{id}/Simple
        // Este endpoint acepta un DTO simplificado desde el frontend
        [HttpPut("{id}/Simple")]
        public async Task<IActionResult> PutSimpleDocumentoAdquisicion(int id, [FromBody] DocumentoAdquisicionDTO dto)
        {
            try
            {
                // Verificar que el documento existe
                var documentoExistente = await _context.DocumentosAdquisicion.FindAsync(id);
                
                if (documentoExistente == null)
                {
                    return NotFound($"No se encontró el documento con ID {id}");
                }
                
                // Encontrar la adquisición relacionada
                var adquisicion = await _context.Adquisiciones.FindAsync(dto.AdquisicionID);
                
                if (adquisicion == null)
                {
                    return BadRequest("Adquisición no encontrada");
                }
                
                // Actualizar los campos del documento con los datos del DTO
                documentoExistente.AdquisicionID = dto.AdquisicionID;
                documentoExistente.Adquisicion = adquisicion;
                documentoExistente.TipoDocumento = dto.TipoDocumento;
                documentoExistente.NumeroDocumento = dto.NumeroDocumento;
                documentoExistente.FechaDocumento = dto.FechaDocumento;
                documentoExistente.Archivo = dto.Archivo;
                
                await _context.SaveChangesAsync();
                
                // Crear registro en el historial para la actualización del documento
                var historial = new HistorialAdquisicion
                {
                    AdquisicionID = dto.AdquisicionID,
                    Adquisicion = adquisicion,
                    FechaModificacion = DateTime.Now,
                    CamposModificados = $"Se actualizó documento (ID: {id}): {dto.TipoDocumento} {dto.NumeroDocumento}"
                };
                
                _context.HistorialAdquisiciones.Add(historial);
                await _context.SaveChangesAsync();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al procesar la solicitud: {ex.Message}");
            }
        }
    }
}
