using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public record ResultadoContacto(string? Error = null, int Status = 200);

public class ContactoService
{
    // Deben coincidir con los validadores de frontend/src/app/sections/contact/contact.ts
    public const int MaxNombre = 100;
    public const int MaxEmail = 200;
    public const int MinMensaje = 10;
    public const int MaxMensaje = 2000;

    private readonly CorreoOptions _correo;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ContactoService> _logger;

    public ContactoService(IOptions<CorreoOptions> correo, IWebHostEnvironment env, ILogger<ContactoService> logger)
    {
        _correo = correo.Value;
        _env = env;
        _logger = logger;
    }

    public static bool EsValido(ContactoRequest r) =>
        !string.IsNullOrWhiteSpace(r.Nombre) && r.Nombre.Length <= MaxNombre &&
        !string.IsNullOrWhiteSpace(r.Email) && r.Email.Length <= MaxEmail &&
        MailboxAddress.TryParse(r.Email, out var direccion) && direccion.Address.Contains('@') &&
        r.Mensaje is { Length: >= MinMensaje and <= MaxMensaje } && r.Mensaje.Trim().Length >= MinMensaje;

    public async Task<ResultadoContacto> EnviarAsync(ContactoRequest r, CancellationToken ct)
    {
        if (!_correo.Configurado)
        {
            // En desarrollo se puede probar el formulario sin servidor de correo: el mensaje sale por consola
            if (_env.IsDevelopment())
            {
                _logger.LogWarning("Correo sin configurar. Mensaje de {Nombre} <{Email}>:\n{Mensaje}", r.Nombre, r.Email, r.Mensaje);
                return new();
            }
            _logger.LogError("Correo sin configurar: revisa la sección Correo de appsettings.json y Correo:Contrasena.");
            return new("El formulario no está disponible ahora mismo.", 503);
        }

        // (Servidor, Remitente y Destinatario no son null: lo garantiza Configurado)
        // Se envía desde tu dirección (si se enviara "desde" la del visitante, los filtros
        // antispam lo rechazarían). Su email va en Reply-To para que contestes con un clic.
        var mensaje = new MimeMessage();
        mensaje.From.Add(new MailboxAddress("Portfolio", _correo.Remitente!));
        mensaje.To.Add(MailboxAddress.Parse(_correo.Destinatario!));
        mensaje.ReplyTo.Add(new MailboxAddress(r.Nombre!.Trim(), r.Email!.Trim()));
        mensaje.Subject = $"Portfolio: mensaje de {r.Nombre.Trim()}";
        mensaje.Body = new TextPart("plain")
        {
            Text = $"Nombre: {r.Nombre.Trim()}\nEmail: {r.Email.Trim()}\n\n{r.Mensaje!.Trim()}"
        };

        try
        {
            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_correo.Servidor!, _correo.Puerto, SecureSocketOptions.Auto, ct);
            if (!string.IsNullOrEmpty(_correo.Usuario))
                await smtp.AuthenticateAsync(_correo.Usuario, _correo.Contrasena ?? "", ct);
            await smtp.SendAsync(mensaje, ct);
            await smtp.DisconnectAsync(true, ct);
            return new();
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "No se pudo enviar el correo de contacto");
            return new("No se pudo enviar el mensaje.", 502);
        }
    }
}
