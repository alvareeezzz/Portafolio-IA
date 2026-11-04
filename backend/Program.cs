using System.Threading.RateLimiting;
using Anthropic;
using Portfolio.Api.Models;
using Portfolio.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ChatOptions>(builder.Configuration.GetSection("Chat"));

// La clave se lee de user-secrets (desarrollo) o de la variable ANTHROPIC_API_KEY (producción).
// Nunca va en appsettings.json ni llega al navegador.
builder.Services.AddSingleton(_ => new AnthropicClient
{
    ApiKey = builder.Configuration["Anthropic:ApiKey"] ?? Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY")
});
builder.Services.AddSingleton<ChatService>();

builder.Services.Configure<CorreoOptions>(builder.Configuration.GetSection("Correo"));
builder.Services.AddSingleton<ContactoService>();

// Límites por visitante: el chat para que nadie dispare el gasto de la API,
// el formulario para que no se use para inundarte el correo
var peticionesPorMinuto = builder.Configuration.GetValue("Chat:PeticionesPorMinuto", 10);
var enviosCadaDiezMinutos = builder.Configuration.GetValue("Correo:EnviosCadaDiezMinutos", 3);
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("chat", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "desconocida",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = peticionesPorMinuto, Window = TimeSpan.FromMinutes(1) }));
    options.AddPolicy("contacto", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "desconocida",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = enviosCadaDiezMinutos, Window = TimeSpan.FromMinutes(10) }));
    // El front muestra su propio texto traducido según el código 429; esto es para quien llame a la API a mano
    options.OnRejected = async (context, token) =>
        await context.HttpContext.Response.WriteAsJsonAsync(
            new ErrorApi("Demasiadas peticiones seguidas. Espera un poco."), token);
});

var app = builder.Build();

app.UseRateLimiter();

// En producción el front compilado de Angular vive en wwwroot/ (ver frontend/angular.json)
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/chat", async (ChatRequest request, ChatService chat, CancellationToken ct) =>
{
    if (!chat.EsValida(request.Mensajes))
        return Results.BadRequest(new ErrorApi("Conversación no válida."));

    var resultado = await chat.ResponderAsync(request.Mensajes, request.Idioma, ct);
    return resultado.Error is null
        ? Results.Ok(new ChatResponse(resultado.Respuesta!))
        : Results.Json(new ErrorApi(resultado.Error), statusCode: resultado.Status);
}).RequireRateLimiting("chat");

app.MapPost("/api/contacto", async (ContactoRequest request, ContactoService contacto, CancellationToken ct) =>
{
    // Campo trampa relleno → es un bot: se le responde "ok" para que no insista, pero no se envía nada
    if (!string.IsNullOrEmpty(request.SitioWeb))
        return Results.Ok();

    if (!ContactoService.EsValido(request))
        return Results.BadRequest(new ErrorApi("Datos de contacto no válidos."));

    var resultado = await contacto.EnviarAsync(request, ct);
    return resultado.Error is null
        ? Results.Ok()
        : Results.Json(new ErrorApi(resultado.Error), statusCode: resultado.Status);
}).RequireRateLimiting("contacto");

// Cualquier otra ruta que no sea /api devuelve la app de Angular
app.MapFallbackToFile("index.html");

app.Run();
