# Etapa de compilación
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install --force

# Copiar el resto del código
COPY . .

# Compilar la aplicación en modo producción
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine

# Eliminar la configuración predeterminada de Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de la aplicación compilada desde la etapa de build
COPY --from=build /app/dist/cootranstame-web/browser/ /usr/share/nginx/html/

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
