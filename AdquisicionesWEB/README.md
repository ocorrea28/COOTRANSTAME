# Sistema de Gestión de Rutas COOTRANSTAME (Frontend)

Este proyecto contiene el frontend desarrollado en Angular para el Sistema de Gestión de Rutas de COOTRANSTAME.

## 🚛 Descripción

Aplicación web moderna desarrollada en Angular 17+ que proporciona una interfaz intuitiva y profesional para la gestión de rutas de transporte de carga y pasajeros para COOTRANSTAME.

### Funcionalidades principales:
- **Gestión de Rutas**: Interfaz completa para CRUD de rutas
- **Validaciones en Tiempo Real**: Sistema avanzado de validación
- **Diseño Profesional**: UI moderna con colores corporativos de COOTRANSTAME
- **Responsive**: Adaptable a dispositivos móviles y desktop
- **Iconografía de Transporte**: Elementos visuales temáticos

## 🏗️ Tecnologías

- **Angular 17+**: Framework principal
- **TypeScript**: Lenguaje de programación
- **CSS3**: Estilos personalizados
- **RxJS**: Programación reactiva
- **Angular Forms**: Manejo de formularios
- **Docker**: Contenedorización con Nginx

## 🚀 Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Angular CLI

### Instalación local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve

# Construir para producción
ng build --configuration production
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── features/
│   │   └── rutas/           # Módulo de rutas
│   │       ├── components/  # Componentes de rutas
│   │       ├── models/      # Modelos TypeScript
│   │       └── services/    # Servicios HTTP
│   │
│   ├── shared/              # Componentes compartidos
│   └── app.component.ts     # Componente principal
├── assets/                  # Recursos estáticos
└── environments/            # Configuraciones de entorno
```

## 🎨 Características de UI

### Diseño COOTRANSTAME
- **Colores corporativos**: Azul profesional y dorado elegante
- **Gradientes**: Efectos visuales modernos
- **Glassmorphism**: Efectos de cristal en elementos
- **Iconografía**: Emojis temáticos de transporte (🚛, 🚌, 🛣️)

### Componentes principales
- **Hero Section**: Sección principal con estadísticas
- **Panel Informativo**: Guías y recomendaciones
- **Formulario Avanzado**: Validaciones en tiempo real
- **Tabla Profesional**: Lista de rutas con filtros
- **Alertas Inteligentes**: Notificaciones contextuales

## 🔧 Validaciones

### Sistema de validación
- **Campos requeridos**: Asteriscos rojos (*)
- **Formato de texto**: Solo letras y espacios
- **Duración**: Rango 0.5-48 horas
- **Lógica de negocio**: Origen ≠ destino
- **Detección de duplicados**: Alertas de rutas similares

### Estados de validación
- ❌ **Error**: Campos inválidos
- ⚠️ **Advertencia**: Situaciones especiales
- 💡 **Ayuda**: Tooltips informativos
- ✅ **Éxito**: Validación correcta

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/demo/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Construcción
```bash
# Construir imagen
docker build -t cootranstame-web .

# Ejecutar contenedor
docker run -p 4200:80 cootranstame-web
```

## 🛠️ Desarrollo

### Comandos útiles
```bash
# Servidor de desarrollo
ng serve --open

# Construcción de producción
ng build --configuration production

# Ejecutar tests
ng test

# Linting
ng lint

# Generar componente
ng generate component nombre-componente
```

### Configuración de entornos
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones móviles
- Navegación colapsible
- Formularios apilados
- Tablas con scroll horizontal
- Botones de tamaño táctil

## 📄 Licencia

Para problemas o consultas sobre este proyecto, contacte con el equipo de desarrollo de COOTRANSTAME.
