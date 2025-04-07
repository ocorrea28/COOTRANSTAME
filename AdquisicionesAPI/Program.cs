using Microsoft.EntityFrameworkCore;
using AdquisicionesAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AdquisicionContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AdquisicionDB")));

// Configuración de CORS para permitir todos los orígenes
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .SetIsOriginAllowed(_ => true) // Permite cualquier origen incluyendo localhost
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // Permite envío de credenciales (cookies, encabezados de autenticación)
});

builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        // Configurar para ignorar referencias circulares en lugar de preservarlas
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        // Use camel case for property names to match frontend models
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar la política CORS configurada anteriormente
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();