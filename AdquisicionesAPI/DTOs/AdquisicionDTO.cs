using System;
using System.ComponentModel.DataAnnotations;

namespace AdquisicionesAPI.DTOs
{
    public class AdquisicionDTO
    {
        [Required]
        public decimal Presupuesto { get; set; }
        
        [Required]
        public int UnidadID { get; set; }
        
        [Required]
        public string TipoBienServicio { get; set; }
        
        [Required]
        public int Cantidad { get; set; }
        
        [Required]
        public decimal ValorUnitario { get; set; }
        
        [Required]
        public decimal ValorTotal { get; set; }
        
        [Required]
        public DateTime FechaAdquisicion { get; set; }
        
        [Required]
        public int ProveedorID { get; set; }
        
        public string? Documentacion { get; set; }
        
        [Required]
        public string Estado { get; set; }
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
