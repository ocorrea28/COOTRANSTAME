using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdquisicionesAPI.Migrations
{
    /// <inheritdoc />
    public partial class AllTablesCruds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Proveedor",
                table: "Adquisiciones");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Adquisiciones",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "Unidad",
                table: "Adquisiciones",
                newName: "TipoBienServicio");

            migrationBuilder.RenameColumn(
                name: "TipoBienOServicio",
                table: "Adquisiciones",
                newName: "Estado");

            migrationBuilder.AlterColumn<decimal>(
                name: "Presupuesto",
                table: "Adquisiciones",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Documentacion",
                table: "Adquisiciones",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "ProveedorID",
                table: "Adquisiciones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnidadID",
                table: "Adquisiciones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DocumentosAdquisicion",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdquisicionID = table.Column<int>(type: "int", nullable: false),
                    TipoDocumento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroDocumento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaDocumento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Archivo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentosAdquisicion", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DocumentosAdquisicion_Adquisiciones_AdquisicionID",
                        column: x => x.AdquisicionID,
                        principalTable: "Adquisiciones",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HistorialAdquisiciones",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdquisicionID = table.Column<int>(type: "int", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CamposModificados = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialAdquisiciones", x => x.ID);
                    table.ForeignKey(
                        name: "FK_HistorialAdquisiciones_Adquisiciones_AdquisicionID",
                        column: x => x.AdquisicionID,
                        principalTable: "Adquisiciones",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Proveedores",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreProveedor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InformacionContacto = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proveedores", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "UnidadesAdministrativas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreUnidad = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnidadesAdministrativas", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Adquisiciones_ProveedorID",
                table: "Adquisiciones",
                column: "ProveedorID");

            migrationBuilder.CreateIndex(
                name: "IX_Adquisiciones_UnidadID",
                table: "Adquisiciones",
                column: "UnidadID");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosAdquisicion_AdquisicionID",
                table: "DocumentosAdquisicion",
                column: "AdquisicionID");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialAdquisiciones_AdquisicionID",
                table: "HistorialAdquisiciones",
                column: "AdquisicionID");

            migrationBuilder.AddForeignKey(
                name: "FK_Adquisiciones_Proveedores_ProveedorID",
                table: "Adquisiciones",
                column: "ProveedorID",
                principalTable: "Proveedores",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Adquisiciones_UnidadesAdministrativas_UnidadID",
                table: "Adquisiciones",
                column: "UnidadID",
                principalTable: "UnidadesAdministrativas",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Adquisiciones_Proveedores_ProveedorID",
                table: "Adquisiciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Adquisiciones_UnidadesAdministrativas_UnidadID",
                table: "Adquisiciones");

            migrationBuilder.DropTable(
                name: "DocumentosAdquisicion");

            migrationBuilder.DropTable(
                name: "HistorialAdquisiciones");

            migrationBuilder.DropTable(
                name: "Proveedores");

            migrationBuilder.DropTable(
                name: "UnidadesAdministrativas");

            migrationBuilder.DropIndex(
                name: "IX_Adquisiciones_ProveedorID",
                table: "Adquisiciones");

            migrationBuilder.DropIndex(
                name: "IX_Adquisiciones_UnidadID",
                table: "Adquisiciones");

            migrationBuilder.DropColumn(
                name: "ProveedorID",
                table: "Adquisiciones");

            migrationBuilder.DropColumn(
                name: "UnidadID",
                table: "Adquisiciones");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Adquisiciones",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "TipoBienServicio",
                table: "Adquisiciones",
                newName: "Unidad");

            migrationBuilder.RenameColumn(
                name: "Estado",
                table: "Adquisiciones",
                newName: "TipoBienOServicio");

            migrationBuilder.AlterColumn<string>(
                name: "Presupuesto",
                table: "Adquisiciones",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "Documentacion",
                table: "Adquisiciones",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Proveedor",
                table: "Adquisiciones",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
