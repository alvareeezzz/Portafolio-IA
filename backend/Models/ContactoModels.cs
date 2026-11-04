namespace Portfolio.Api.Models;

// Lo que envía el formulario de Angular (ver frontend/src/app/sections/contact/contacto.service.ts).
// SitioWeb es un campo trampa invisible: una persona nunca lo rellena, un bot de spam sí.
public record ContactoRequest(string? Nombre, string? Email, string? Mensaje, string? SitioWeb);

// Sección "Correo" de appsettings.json. La contraseña va en user-secrets (Correo:Contrasena).
public class CorreoOptions
{
    public string? Servidor { get; set; }
    public int Puerto { get; set; } = 587;
    public string? Usuario { get; set; }
    public string? Contrasena { get; set; }
    public string? Remitente { get; set; }     // dirección desde la que se envía (la tuya)
    public string? Destinatario { get; set; }  // dónde quieres recibir los mensajes

    public bool Configurado =>
        !string.IsNullOrWhiteSpace(Servidor) &&
        !string.IsNullOrWhiteSpace(Remitente) &&
        !string.IsNullOrWhiteSpace(Destinatario);
}
