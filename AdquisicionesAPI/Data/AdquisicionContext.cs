using Microsoft.EntityFrameworkCore;
using AdquisicionesAPI.Models;

namespace AdquisicionesAPI.Data
{
    public class AdquisicionContext : DbContext
    {
        public AdquisicionContext(DbContextOptions<AdquisicionContext> options) : base(options)
        {
        }

        public DbSet<Ruta> Rutas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración para la tabla Rutas
            modelBuilder.Entity<Ruta>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Origen).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Destino).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Duracion).IsRequired();
                entity.Property(e => e.Tipo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETDATE()");
            });
        }
    }
}