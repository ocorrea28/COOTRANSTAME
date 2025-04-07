# Sistema de Adquisiciones ADRES (Frontend)

Este proyecto contiene el frontend desarrollado en Angular para el Sistema de Gestión de Adquisiciones de ADRES.

## Características

- Interfaz de usuario completa para gestionar adquisiciones, proveedores, unidades administrativas y documentos
- Diseño responsivo con Bootstrap y CSS personalizado
- Componentes reutilizables (tablas, botones, modales)
- Filtrado y búsqueda de información
- Validaciones de formularios
- Navegación entre componentes mediante Angular Router

## Estructura del Proyecto

- **src/app/core**: Modelos de datos y repositorios para comunicación con API
- **src/app/features**: Componentes específicos para cada entidad del sistema
- **src/app/shared**: Componentes compartidos y utilitarios
- **src/app/layout**: Componentes de estructura general (header, footer, etc.)

## Requisitos de Desarrollo

- Node.js (versión 18 o superior)
- Angular CLI (versión 17 o superior)
- NPM (versión 9 o superior)

## Ejecución en Entorno Local

### Instalación de Dependencias

```bash
npm install
```

### Servidor de Desarrollo

```bash
ng serve
```

El servidor de desarrollo se iniciará en `http://localhost:4200/`.

## Construcción para Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en el directorio `dist/`.

## Ejecución con Docker

### Construcción de la Imagen

```bash
docker build -t adquisiciones-web .
```

### Ejecución del Contenedor

```bash
docker run -d -p 4200:80 --name adquisiciones-web adquisiciones-web
```

La aplicación estará disponible en `http://localhost:4200/`.

## Ejecución con Docker Compose

Este proyecto puede ejecutarse de forma integrada con el backend utilizando Docker Compose.
Para más detalles consulte el archivo `README.md` en la raíz del proyecto.

```bash
# Desde la raíz del proyecto (carpeta padre)
docker-compose up -d
```

## Principales Componentes

- **AdquisicionListComponent**: Listado y gestión de adquisiciones
- **ProveedorListComponent**: Listado y gestión de proveedores
- **UnidadAdministrativaListComponent**: Listado y gestión de unidades administrativas
- **DocumentoAdquisicionListComponent**: Listado y gestión de documentos de adquisición
- **HistorialAdquisicionListComponent**: Historial de cambios de adquisiciones

## Configuración de Entorno

Los archivos de configuración de entorno se encuentran en:

- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

Aquí se configuran las URLs de API y otras variables de entorno.

## Contacto y Soporte

Para problemas o consultas sobre este proyecto, contacte con el equipo de desarrollo de ADRES.
