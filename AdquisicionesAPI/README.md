# Sistema de Gestión de Rutas COOTRANSTAME (Backend)

Este proyecto contiene el backend desarrollado en .NET para el Sistema de Gestión de Rutas de COOTRANSTAME.

## 🚛 Descripción

API REST desarrollada en .NET 8 que proporciona servicios para la gestión de rutas de transporte de carga y pasajeros para COOTRANSTAME.

### Funcionalidades principales:
- **Gestión de Rutas**: CRUD completo para rutas de transporte
- **Validaciones**: Sistema robusto de validación de datos
- **Base de Datos**: Integración con SQL Server usando Entity Framework Core
- **Documentación**: Swagger/OpenAPI integrado

## 🏗️ Tecnologías

- **.NET 8**: Framework principal
- **Entity Framework Core**: ORM para base de datos
- **SQL Server**: Base de datos
- **Swagger**: Documentación de API
- **Docker**: Contenedorización

## 🚀 Configuración

### Prerrequisitos
- .NET 8 SDK
- SQL Server (o Docker)

### Variables de entorno
```bash
ConnectionStrings__AdquisicionDB="Server=localhost;Database=AdquisicionesDB;User Id=sa;Password=CootranstamePassword123!;TrustServerCertificate=true;"
```

### Instalación local
```bash
# Restaurar paquetes
dotnet restore

# Aplicar migraciones
dotnet ef database update

# Ejecutar aplicación
dotnet run
```

## 📋 Endpoints

### Rutas
- `GET /api/rutas` - Obtener todas las rutas
- `GET /api/rutas/{id}` - Obtener ruta por ID
- `POST /api/rutas` - Crear nueva ruta
- `PUT /api/rutas/{id}` - Actualizar ruta
- `DELETE /api/rutas/{id}` - Eliminar ruta

### Documentación
- `GET /swagger` - Documentación interactiva de la API

## 🗄️ Base de Datos

### Modelo de datos
```sql
Rutas:
- Id (int, PK)
- Origen (nvarchar(100))
- Destino (nvarchar(100))
- Duracion (decimal)
- Tipo (nvarchar(50))
- FechaCreacion (datetime2)
```

### Migraciones
```bash
# Crear nueva migración
dotnet ef migrations add NombreMigracion

# Aplicar migraciones
dotnet ef database update

# Revertir migración
dotnet ef database update MigracionAnterior
```

## 🐳 Docker

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "AdquisicionesAPI.dll"]
```

### Construcción
```bash
# Construir imagen
docker build -t cootranstame-api .

# Ejecutar contenedor
docker run -p 8080:8080 cootranstame-api
```

## 🔧 Desarrollo

### Estructura del proyecto
```
AdquisicionesAPI/
├── Controllers/          # Controladores de API
├── Models/              # Modelos de datos
├── Data/                # Contexto de base de datos
├── Migrations/          # Migraciones EF Core
├── Program.cs           # Punto de entrada
└── appsettings.json     # Configuración
```

### Comandos útiles
```bash
# Ejecutar en modo desarrollo
dotnet run --environment Development

# Ejecutar tests
dotnet test

# Generar documentación
dotnet build --verbosity normal
```

## 📄 Licencia

Para problemas o consultas sobre este proyecto, contacte con el equipo de desarrollo de COOTRANSTAME.
