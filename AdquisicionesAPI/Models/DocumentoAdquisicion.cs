using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdquisicionesAPI.Models
{
    public class DocumentoAdquisicion
    {
        public int ID { get; set; }
        
        [Required]
        public int AdquisicionID { get; set; }
        
        [ForeignKey("AdquisicionID")]
        public required Adquisicion Adquisicion { get; set; }
        
        [Required]
        public required string TipoDocumento { get; set; }
        
        [Required]
        public required string NumeroDocumento { get; set; }
        
        [Required]
        public DateTime FechaDocumento { get; set; }
        
        public string? Archivo { get; set; }
    }
}
