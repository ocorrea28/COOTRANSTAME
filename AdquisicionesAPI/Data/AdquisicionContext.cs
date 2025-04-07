using Microsoft.EntityFrameworkCore;
using AdquisicionesAPI.Models;

namespace AdquisicionesAPI.Data
{
    public class AdquisicionContext : DbContext
    {
        public AdquisicionContext(DbContextOptions<AdquisicionContext> options) : base(options)
        {
        }

        public DbSet<Adquisicion> Adquisiciones { get; set; }
        public DbSet<UnidadAdministrativa> UnidadesAdministrativas { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<HistorialAdquisicion> HistorialAdquisiciones { get; set; }
        public DbSet<DocumentoAdquisicion> DocumentosAdquisicion { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Adquisicion>()
                .HasOne(a => a.UnidadAdministrativa)
                .WithMany()
                .HasForeignKey(a => a.UnidadID);

            modelBuilder.Entity<Adquisicion>()
                .HasOne(a => a.Proveedor)
                .WithMany()
                .HasForeignKey(a => a.ProveedorID);

            modelBuilder.Entity<HistorialAdquisicion>()
                .HasOne(h => h.Adquisicion)
                .WithMany(a => a.Historial)
                .HasForeignKey(h => h.AdquisicionID);

            modelBuilder.Entity<DocumentoAdquisicion>()
                .HasOne(d => d.Adquisicion)
                .WithMany(a => a.Documentos)
                .HasForeignKey(d => d.AdquisicionID);
        }
    }
}