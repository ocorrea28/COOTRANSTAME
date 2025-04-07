using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdquisicionesAPI.Models
{
    public class HistorialAdquisicion
    {
        public int ID { get; set; }
        
        [Required]
        public int AdquisicionID { get; set; }
        
        [ForeignKey("AdquisicionID")]
        public required Adquisicion Adquisicion { get; set; }
        
        [Required]
        public DateTime FechaModificacion { get; set; }
        
        [Required]
        public required string CamposModificados { get; set; }
    }
}
