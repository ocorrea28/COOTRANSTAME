# Sistema de Adquisiciones ADRES

Este repositorio contiene el Sistema de Gestión de Adquisiciones de ADRES, una aplicación completa para gestionar adquisiciones, proveedores, unidades administrativas, documentos y más.

## Estructura del Proyecto

El proyecto está estructurado en dos componentes principales:

- **AdquisicionesAPI**: Backend desarrollado en .NET que proporciona los servicios REST.
- **AdquisicionesWEB**: Frontend desarrollado en Angular que proporciona la interfaz de usuario.

## Requisitos Previos

Para ejecutar este proyecto necesitarás:

- [Docker](https://www.docker.com/products/docker-desktop/) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)
- Al menos 4GB de RAM disponible para Docker
- Espacio en disco: aproximadamente 2GB

## Ejecutar el Proyecto con Docker Compose

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ocorrea28/Adres.git
cd Adres
```

### 2. Iniciar los Contenedores

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Este comando construirá las imágenes necesarias (si no existen) e iniciará todos los servicios definidos en el archivo `docker-compose.yml`.

### 3. Verificar que los Contenedores están Funcionando

```bash
docker-compose ps
```

Deberías ver los siguientes servicios:
- `adquisiciones-api` - Backend API
- `adquisiciones-web` - Frontend Angular
- `adquisiciones-db` - Base de datos SQL Server

### 4. Acceder a la Aplicación

Una vez que todos los contenedores estén en ejecución:

- **Frontend**: http://localhost:4200
- **API**: http://localhost:5000/swagger

## Detalles de los Contenedores

### Frontend (AdquisicionesWEB)

- **Puerto**: 4200
- **Tecnología**: Angular 19
- **Entorno**: Node.js 20

### Backend (AdquisicionesAPI)

- **Puerto**: 5000
- **Tecnología**: .NET 8
- **Endpoints principales**:
  - `/api/adquisiciones`
  - `/api/proveedores`
  - `/api/unidades-administrativas`
  - `/api/documentos-adquisicion`
  - `/api/historial-adquisiciones`

### Base de Datos (SQL Server)

- **Puerto**: 1433
- **Usuario por defecto**: sa
- **Contraseña por defecto**: AdresPassword123!
- **Base de datos**: AdquisicionesDB

## Comandos Útiles

### Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs adquisiciones-web
docker-compose logs adquisiciones-api
```

### Detener los Contenedores

```bash
# Detener pero no eliminar los contenedores
docker-compose stop

# Detener y eliminar los contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes (¡borra la base de datos!)
docker-compose down -v
```

### Reconstruir las Imágenes

Si realizas cambios en el código fuente y necesitas reconstruir las imágenes:

```bash
docker-compose build
# o para un servicio específico
docker-compose build adquisiciones-web
```

## Variables de Entorno

Las variables de entorno se definen en el archivo `.env` (crear si no existe) en la raíz del proyecto.

Ejemplo:
```
# Configuración de la Base de Datos
DB_USER=sa
DB_PASSWORD=AdresPassword123!
DB_NAME=AdquisicionesDB

# Configuración de API
API_PORT=5000

# Configuración Web
WEB_PORT=4200
```

## Solución de Problemas

### Problemas de Conexión a la Base de Datos

Si el API no puede conectarse a la base de datos:

1. Verifica que el contenedor de SQL Server esté en ejecución:
   ```bash
   docker-compose ps adquisiciones-db
   ```

2. Verifica los logs de la base de datos:
   ```bash
   docker-compose logs adquisiciones-db
   ```

3. Asegúrate de que la cadena de conexión sea correcta en el archivo `appsettings.json` del API.

### El Frontend no Puede Comunicarse con el API

1. Verifica que ambos contenedores estén funcionando:
   ```bash
   docker-compose ps
   ```

2. Verifica que la URL del API configurada en el entorno de Angular sea correcta.

## Desarrollo Local

Para desarrollo local sin Docker, consulta los README específicos en las carpetas:
- `/AdquisicionesAPI/README.md`
- `/AdquisicionesWEB/README.md`

## Licencia

Este proyecto es propiedad de ADRES y está destinado únicamente para uso interno.
# Adres
