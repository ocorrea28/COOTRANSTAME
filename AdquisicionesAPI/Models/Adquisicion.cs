using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace AdquisicionesAPI.Models
{
    public class Adquisicion
    {
        public int ID { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Presupuesto { get; set; }
        
        [Required]
        public int UnidadID { get; set; }
        
        [ForeignKey("UnidadID")]
        public required UnidadAdministrativa UnidadAdministrativa { get; set; }
        
        [Required]
        public required string TipoBienServicio { get; set; }
        
        [Required]
        public int Cantidad { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorUnitario { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorTotal { get; set; }
        
        [Required]
        public DateTime FechaAdquisicion { get; set; }
        
        [Required]
        public int ProveedorID { get; set; }
        
        [ForeignKey("ProveedorID")]
        public required Proveedor Proveedor { get; set; }
        
        public string? Documentacion { get; set; }
        
        [Required]
        public required string Estado { get; set; }
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaDesactivacion { get; set; }
        
        public virtual ICollection<HistorialAdquisicion>? Historial { get; set; }
        public virtual ICollection<DocumentoAdquisicion>? Documentos { get; set; }
    }
}