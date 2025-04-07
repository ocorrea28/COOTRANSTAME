using System.ComponentModel.DataAnnotations;

namespace AdquisicionesAPI.Models
{
    public class UnidadAdministrativa
    {
        public int ID { get; set; }
        
        [Required]
        public required string NombreUnidad { get; set; }
    }
}
