# Portafolio IA

Portfolio personal al que se le puede preguntar: un chat con IA (Claude) responde en primera persona
a partir del perfil. Front en **Angular 20**, back en **ASP.NET Core (.NET 10)**.

- Chat con IA, con respuestas predefinidas de respaldo si la API no está disponible
- Formulario de contacto en un modal, que llega por email
- Español, catalán e inglés
- Modo claro y oscuro

## Estructura

```
├── frontend/                       App Angular (lo que ve el visitante)
│   ├── src/app/
│   │   ├── data/portfolio.ts       ← TUS DATOS en los tres idiomas: experiencia, proyectos…
│   │   ├── i18n/textos.ts          textos de la interfaz en los tres idiomas
│   │   ├── layout/                 barra de navegación, selector de idioma, interruptor de tema, pie
│   │   ├── sections/               portada, experiencia/formación, proyectos, contacto (y su modal)
│   │   └── chat/                   chat, conversación compartida, respuestas sin IA
│   ├── src/styles.css              estilos globales y colores de los dos temas
│   ├── public/assets/              CV, imágenes… (pon aquí tu cv.pdf)
│   └── proxy.conf.json             en desarrollo, redirige /api al backend
│
└── backend/                        API .NET (nunca se envía al navegador)
    ├── Program.cs                  arranque: /api/chat, /api/contacto, límites por visitante
    ├── Services/ChatService.cs     habla con Claude
    ├── Services/ContactoService.cs envía los mensajes del formulario por email
    ├── Models/                     formato de peticiones, respuestas y opciones
    ├── Data/perfil.md              ← LO QUE SABE LA IA DE TI
    ├── appsettings.json            modelo de IA, límites, servidor de correo
    └── wwwroot/                    (generado) Angular compilado
```

## Configuración (una sola vez)

Las claves se guardan con *user-secrets*, fuera de la carpeta del proyecto, así nunca acaban en Git:

```bash
cd backend
dotnet user-secrets set "Anthropic:ApiKey" "sk-ant-..."
dotnet user-secrets set "Correo:Contrasena" "contraseña-de-aplicación"
```

Para el formulario de contacto, rellena también la sección `Correo` de `appsettings.json`
(servidor SMTP, usuario, remitente y destinatario). Sin ella, en desarrollo los mensajes se muestran por consola.

En producción, usa variables de entorno: `ANTHROPIC_API_KEY` y `Correo__Contrasena`.

## Desarrollo (dos terminales)

```bash
# Terminal 1 – API en http://localhost:5267
cd backend
dotnet run

# Terminal 2 – Angular con recarga automática en http://localhost:4200
cd frontend
npm install   # solo la primera vez
npm start
```

Abre http://localhost:4200. Las llamadas a `/api` se redirigen solas al backend.

## Producción

```bash
cd frontend && npx ng build        # compila Angular en backend/wwwroot
cd ../backend && dotnet publish -c Release
```

El backend publicado sirve la web y la API desde el mismo sitio.
