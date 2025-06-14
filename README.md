# Sistema de Gestión de Rutas COOTRANSTAME

Este repositorio contiene el Sistema de Gestión de Rutas de COOTRANSTAME, una aplicación completa para gestionar rutas de transporte de carga y pasajeros.

## 🚛 Descripción

Sistema web desarrollado para COOTRANSTAME que permite:

- **Gestión de Rutas**: Registro, edición y eliminación de rutas de transporte
- **Tipos de Servicio**: Manejo de rutas para carga y pasajeros
- **Validaciones Avanzadas**: Sistema completo de validación de datos
- **Interfaz Moderna**: Diseño profesional y responsivo
- **Base de Datos**: Almacenamiento seguro con SQL Server

## 🏗️ Arquitectura

- **Frontend**: Angular 17+ con diseño moderno
- **Backend**: .NET 8 Web API
- **Base de Datos**: SQL Server (Azure SQL Edge)
- **Contenedores**: Docker y Docker Compose

## 🚀 Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose
- Git

### Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/ocorrea28/COOTRANSTAME.git
cd COOTRANSTAME
```

2. **Ejecutar con Docker Compose**:
```bash
docker compose up -d --build
```

3. **Acceder a la aplicación**:
   - Frontend: http://localhost:4200
   - API: http://localhost:3000

## 🔧 Configuración de Base de Datos

### Credenciales por defecto

- **Usuario**: sa
- **Contraseña por defecto**: CootranstamePassword123!
- **Base de datos**: AdquisicionesDB
- **Puerto**: 1433

### Migración inicial

La base de datos se crea automáticamente al iniciar la aplicación. Las migraciones se ejecutan automáticamente.

## 📁 Estructura del Proyecto

```
COOTRANSTAME/
├── AdquisicionesAPI/          # Backend .NET
│   ├── Controllers/           # Controladores API
│   ├── Models/               # Modelos de datos
│   ├── Data/                 # Contexto de base de datos
│   └── Migrations/           # Migraciones EF Core
├── AdquisicionesWEB/         # Frontend Angular
│   ├── src/app/             # Aplicación Angular
│   ├── src/app/features/    # Módulos por funcionalidad
│   └── src/app/shared/      # Componentes compartidos
├── docker-compose.yml        # Configuración Docker
└── README.md                # Este archivo
```

## 🐳 Docker

### Servicios

- **sqlserver**: Base de datos SQL Server
- **adquisicionesapi**: API Backend (.NET)
- **adquisicionesweb**: Frontend (Angular + Nginx)

### Variables de entorno

```env
# Base de datos
SA_PASSWORD=Your_password123
ACCEPT_EULA=1
MSSQL_PID=Developer

# API
ConnectionStrings__AdquisicionDB=Server=sqlserver;Database=AdquisicionesDB;User Id=sa;Password=Your_password123;TrustServerCertificate=true;

# Para desarrollo local
DB_SERVER=localhost
DB_NAME=AdquisicionesDB
DB_USER=sa
DB_PASSWORD=CootranstamePassword123!
```

## 🔍 Funcionalidades

### Gestión de Rutas
- ✅ Registro de nuevas rutas
- ✅ Edición de rutas existentes
- ✅ Eliminación de rutas
- ✅ Filtrado por tipo de servicio
- ✅ Validaciones en tiempo real

### Validaciones
- ✅ Campos requeridos
- ✅ Formato de ciudades
- ✅ Duración de rutas
- ✅ Detección de duplicados
- ✅ Ciudades origen ≠ destino

### Interfaz de Usuario
- ✅ Diseño profesional COOTRANSTAME
- ✅ Responsive design
- ✅ Iconografía de transporte
- ✅ Alertas y notificaciones
- ✅ Estados de carga

## 🛠️ Desarrollo

### Comandos útiles

```bash
# Levantar servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Reconstruir servicios
docker compose up -d --build

# Parar servicios
docker compose down

# Limpiar volúmenes
docker compose down -v
```

## 📄 Licencia

Este proyecto es propiedad de COOTRANSTAME y está destinado únicamente para uso interno.

# COOTRANSTAME
