using System;
using System.ComponentModel.DataAnnotations;

namespace AdquisicionesAPI.DTOs
{
    public class DocumentoAdquisicionDTO
    {
        [Required]
        public int AdquisicionID { get; set; }
        
        [Required]
        public string TipoDocumento { get; set; }
        
        [Required]
        public string NumeroDocumento { get; set; }
        
        [Required]
        public DateTime FechaDocumento { get; set; }
        
        public string? Archivo { get; set; }
    }
}
