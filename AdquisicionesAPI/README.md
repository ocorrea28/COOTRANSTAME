# Sistema de Adquisiciones ADRES (Backend)

Este proyecto contiene el backend desarrollado en .NET para el Sistema de Gestión de Adquisiciones de ADRES.

## Características

- API RESTful para gestión de adquisiciones, proveedores, unidades administrativas y documentos
- Arquitectura en capas (Controladores, Servicios, Repositorios, Modelos)
- Base de datos SQL Server con Entity Framework Core
- Autenticación y autorización
- Documentación de API con Swagger
- Logs y manejo de excepciones

## Estructura del Proyecto

- **AdquisicionesAPI**: Proyecto principal de API
  - **Controllers**: Controladores REST para cada entidad
  - **Models**: Modelos de datos y DTOs
  - **Services**: Lógica de negocio
  - **Repositories**: Acceso a datos
  - **Middleware**: Componentes de middleware personalizados
  - **Extensions**: Métodos de extensión para configuración

## Requisitos de Desarrollo

- .NET 8 SDK
- SQL Server (o SQL Server Express)
- Visual Studio 2022 o Visual Studio Code

## Ejecución en Entorno Local

### Configuración de Base de Datos

1. Actualiza la cadena de conexión en `appsettings.json`:

```json
"ConnectionStrings": {
  "AdquisicionDB": "Server=localhost;Database=AdquisicionesDB;User Id=sa;Password=YourPassword;TrustServerCertificate=true;"
}
```

2. Ejecuta las migraciones para crear la base de datos:

```bash
dotnet ef database update
```

### Ejecución del Proyecto

```bash
dotnet run
```

La API estará disponible en `https://localhost:5001` y `http://localhost:5000`.

## Endpoints Principales

- **GET /api/adquisiciones**: Obtener todas las adquisiciones
- **GET /api/adquisiciones/{id}**: Obtener una adquisición por ID
- **POST /api/adquisiciones**: Crear una nueva adquisición
- **PUT /api/adquisiciones/{id}**: Actualizar una adquisición existente
- **DELETE /api/adquisiciones/{id}**: Eliminar una adquisición

Endpoints similares existen para:
- `/api/proveedores`
- `/api/unidades-administrativas`
- `/api/documentos-adquisicion`
- `/api/historial-adquisiciones`

## Documentación de API

La documentación completa de la API está disponible en Swagger:
- Entorno local: `http://localhost:5000/swagger`

## Ejecución con Docker

### Construcción de la Imagen

```bash
docker build -t adquisiciones-api .
```

### Ejecución del Contenedor

```bash
docker run -d -p 5000:80 -e "ConnectionStrings__AdquisicionDB=Server=host.docker.internal;Database=AdquisicionesDB;User Id=sa;Password=YourPassword;TrustServerCertificate=true;" --name adquisiciones-api adquisiciones-api
```

La API estará disponible en `http://localhost:5000/`.

## Ejecución con Docker Compose

Este proyecto puede ejecutarse de forma integrada con el frontend y la base de datos utilizando Docker Compose.
Para más detalles consulte el archivo `README.md` en la raíz del proyecto.

```bash
# Desde la raíz del proyecto (carpeta padre)
docker-compose up -d
```

## Desarrollo y Extensión

### Agregar una Nueva Entidad

1. Crear el modelo en `Models`
2. Agregar DbSet en `ApplicationDbContext`
3. Crear la migración con `dotnet ef migrations add NombreMigracion`
4. Crear el repositorio en `Repositories`
5. Crear el servicio en `Services`
6. Crear el controlador en `Controllers`

## Contacto y Soporte

Para problemas o consultas sobre este proyecto, contacte con el equipo de desarrollo de ADRES.
