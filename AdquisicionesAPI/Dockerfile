# Fase 1: Define la imagen base con el runtime de .NET 8.0
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Fase 2: Construye la aplicación, descargando dependencias y compilando
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore

# Copia el resto de los archivos de la aplicación
COPY . .
WORKDIR /src
RUN dotnet build -c Release -o /app

# Fase 3: Publica la aplicación en modo Release
FROM build AS publish
RUN dotnet publish -c Release -o /app

# Fase 4: Crea la imagen final y define el punto de entrada de la aplicación
FROM base AS final
WORKDIR /app
COPY --from=publish /app .

ENTRYPOINT ["dotnet", "AdquisicionesAPI.dll"]