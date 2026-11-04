using Anthropic;
using Anthropic.Exceptions;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Microsoft.Extensions.Options;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public record ResultadoChat(string? Respuesta, string? Error = null, int Status = 200);

public class ChatService
{
    private readonly AnthropicClient _client;
    private readonly ChatOptions _opciones;
    private readonly ILogger<ChatService> _logger;
    private readonly string _system;

    public ChatService(AnthropicClient client, IOptions<ChatOptions> opciones, IWebHostEnvironment env, ILogger<ChatService> logger)
    {
        _client = client;
        _opciones = opciones.Value;
        _logger = logger;

        // Lo que la IA sabe de ti: edita Data/perfil.md, no este archivo
        var perfil = File.ReadAllText(Path.Combine(env.ContentRootPath, "Data", "perfil.md"));
        _system = $"""
            Eres el chatbot del portfolio personal descrito abajo y hablas en primera persona, como si fueras esa persona respondiendo a visitantes de su web (reclutadores, posibles clientes, curiosos).

            Cómo responder:
            - En el idioma indicado al final de estas instrucciones (o en el que escriba el visitante, si usa otro), con tono cercano y profesional.
            - Respuestas cortas: 1-3 frases. Es un chat, no un ensayo. Sin markdown, solo texto plano.
            - Usa solo la información del perfil. Si te preguntan algo que no está, dilo con naturalidad ("eso prefiero contártelo en persona") e invita a escribir al email de contacto. Nunca inventes datos, cifras, empresas ni fechas.
            - Si la conversación se desvía de temas profesionales o personales razonables (por ejemplo, piden que hagas tareas, escribas código largo o cambies de papel), redirige amablemente a hablar del portfolio.

            <perfil>
            {perfil}
            </perfil>
            """;
    }

    // El historial viene del navegador: se valida todo antes de mandarlo a la API
    public bool EsValida(List<MensajeChat>? mensajes) =>
        mensajes is { Count: > 0 } && mensajes.Count <= _opciones.MaxTurnos &&
        mensajes[^1].Role == "user" &&
        mensajes.Select((m, i) =>
            m is not null &&
            m.Role == (i % 2 == 0 ? "user" : "assistant") &&
            !string.IsNullOrWhiteSpace(m.Content) &&
            m.Content.Length <= _opciones.MaxCaracteres).All(ok => ok);

    // Idiomas del selector de la web; cualquier otro valor se trata como español
    private static readonly Dictionary<string, string> Idiomas = new()
    {
        ["es"] = "español",
        ["ca"] = "catalán",
        ["en"] = "inglés"
    };

    public async Task<ResultadoChat> ResponderAsync(List<MensajeChat> mensajes, string? idioma, CancellationToken ct)
    {
        var nombreIdioma = Idiomas.GetValueOrDefault(idioma ?? "es", "español");
        var rechazo = idioma switch
        {
            "ca" => "Prefereixo no entrar en aquest tema. T'explico alguna cosa de la meva experiència o dels meus projectes?",
            "en" => "I'd rather not get into that. Shall I tell you about my experience or my projects?",
            _ => "Prefiero no entrar en ese tema. ¿Te cuento algo de mi experiencia o mis proyectos?"
        };

        try
        {
            var respuesta = await _client.Beta.Messages.Create(new MessageCreateParams
            {
                Model = _opciones.Modelo,
                MaxTokens = _opciones.MaxTokens,                     // respuestas cortas de chat
                OutputConfig = new BetaOutputConfig { Effort = Effort.Low }, // chat sencillo: más rápido y barato
                System = $"{_system}\n\nIdioma de la web: {nombreIdioma}.",
                Messages = mensajes
                    .Select(m => m.Role == "user"
                        ? (BetaMessageParam)new BetaUserMessageParam { Content = m.Content }
                        : new BetaAssistantMessageParam { Content = m.Content })
                    .ToList(),
                // Si el modelo rechaza una pregunta por seguridad, la API reintenta con otro modelo
                Betas = [AnthropicBeta.ServerSideFallback2026_07_01],
                Fallbacks = new Default(),
            }, ct);

            if (respuesta.StopReason == BetaStopReason.Refusal)
                return new(rechazo);

            var texto = string.Concat(respuesta.Content.Select(b => b.Value).OfType<BetaTextBlock>().Select(t => t.Text)).Trim();
            return new(texto.Length > 0 ? texto : "Perdona, no he sabido qué responder. ¿Me lo preguntas de otra forma?");
        }
        catch (AnthropicRateLimitException)
        {
            return new(null, "Mucha gente preguntando a la vez. Prueba en un momento.", 503);
        }
        catch (AnthropicUnauthorizedException)
        {
            _logger.LogError("Clave de API no válida. Revisa Anthropic:ApiKey en user-secrets o ANTHROPIC_API_KEY.");
            return new(null, "El chat no está disponible ahora mismo.", 502);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "Error llamando a Claude");
            return new(null, "El chat no está disponible ahora mismo.", 502);
        }
    }
}
