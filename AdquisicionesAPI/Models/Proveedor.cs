using System.ComponentModel.DataAnnotations;

namespace AdquisicionesAPI.Models
{
    public class Proveedor
    {
        public int ID { get; set; }
        
        [Required]
        public required string NombreProveedor { get; set; }
        
        public string? InformacionContacto { get; set; }
    }
}
