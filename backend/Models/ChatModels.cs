namespace Portfolio.Api.Models;

// Lo que envía y recibe el chat de Angular (ver frontend/src/app/chat/chat.service.ts)
public record MensajeChat(string Role, string Content);

// Idioma: "es", "ca" o "en", el que tenga seleccionado la web
public record ChatRequest(List<MensajeChat> Mensajes, string? Idioma);

public record ChatResponse(string Respuesta);

// Error que devuelve cualquier endpoint de la API: {"error": "..."}
public record ErrorApi(string Error);

// Sección "Chat" de appsettings.json
public class ChatOptions
{
    public string Modelo { get; set; } = "claude-opus-5-5";
    public int MaxTokens { get; set; } = 1024;
    public int MaxTurnos { get; set; } = 20;
    public int MaxCaracteres { get; set; } = 500;
}
