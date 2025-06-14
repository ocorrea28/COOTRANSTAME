using System.ComponentModel.DataAnnotations;

namespace AdquisicionesAPI.Models
{
    public class Ruta
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "El origen es requerido")]
        [StringLength(100, ErrorMessage = "El origen no puede exceder 100 caracteres")]
        public string Origen { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El destino es requerido")]
        [StringLength(100, ErrorMessage = "El destino no puede exceder 100 caracteres")]
        public string Destino { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "La duración es requerida")]
        [Range(1, int.MaxValue, ErrorMessage = "La duración debe ser mayor a 0")]
        public int Duracion { get; set; } // Duración en horas
        
        [Required(ErrorMessage = "El tipo es requerido")]
        [StringLength(50, ErrorMessage = "El tipo no puede exceder 50 caracteres")]
        public string Tipo { get; set; } = string.Empty; // "Carga" o "Pasajeros"
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
} 