// Textos fijos de la interfaz en cada idioma.
// Tu contenido (experiencia, proyectos…) está en data/portfolio.ts.

export type Idioma = 'es' | 'ca' | 'en';

export const IDIOMAS: { codigo: Idioma; nombre: string }[] = [
  { codigo: 'es', nombre: 'Español' },
  { codigo: 'ca', nombre: 'Català' },
  { codigo: 'en', nombre: 'English' }
];

const ES = {
  nav: { principal: 'Principal', inicio: 'Inicio' },
  secciones: {
    sobreMi: 'Sobre mí',
    experiencia: 'Experiencia',
    formacion: 'Formación',
    habilidades: 'Habilidades',
    proyectos: 'Proyectos',
    contacto: 'Contacto'
  },
  hero: {
    contactar: 'Contactar',
    descargarCv: 'Descargar CV',
    preguntaEtiqueta: 'Pregúntame lo que quieras',
    preguntaEjemplo: '¿En qué has trabajado últimamente?',
    preguntar: 'Preguntar'
  },
  chat: {
    titulo: 'Pregúntame',
    intro: 'Pregúntale a mi asistente con IA lo que quieras saber de mí: responde a partir de mi experiencia y mis proyectos.',
    saludo: (nombre: string) => `¡Hola! Soy ${nombre}. Pregúntame lo que quieras sobre mi experiencia, proyectos o cómo contactarme.`,
    sugerencias: ['¿A qué te dedicas?', '¿Qué tecnologías usas?', 'Háblame de tus proyectos', '¿Cómo te contacto?'],
    conversacion: 'Conversación',
    etiqueta: 'Escribe tu pregunta',
    placeholder: 'Escribe tu pregunta…',
    enviar: 'Enviar',
    escribiendo: 'Escribiendo',
    tu: 'Tú',
    errores: {
      limite: 'Demasiados mensajes seguidos. Espera un minuto.',
      saturado: 'Mucha gente preguntando a la vez. Prueba en un momento.',
      noDisponible: 'El chat no está disponible ahora mismo.'
    }
  },
  contacto: {
    formTitulo: 'Escríbeme',
    nombre: 'Nombre',
    email: 'Email',
    mensaje: 'Mensaje',
    enviar: 'Enviar mensaje',
    enviando: 'Enviando…',
    exito: '¡Gracias! He recibido tu mensaje y te responderé pronto.',
    cerrar: 'Cerrar',
    errores: {
      requerido: 'Este campo es obligatorio.',
      email: 'Escribe un email válido.',
      corto: (min: number) => `Escribe al menos ${min} caracteres.`,
      largo: (max: number) => `Máximo ${max} caracteres.`,
      limite: 'Has enviado varios mensajes seguidos. Espera unos minutos.',
      noEnviado: (email: string) => `No se ha podido enviar. Escríbeme directamente a ${email}.`
    }
  },
  tema: { etiqueta: 'Modo oscuro', aClaro: 'Cambiar a modo claro', aOscuro: 'Cambiar a modo oscuro' },
  idioma: 'Idioma'
};

export const TEXTOS: Record<Idioma, typeof ES> = {
  es: ES,

  ca: {
    nav: { principal: 'Principal', inicio: 'Inici' },
    secciones: {
      sobreMi: 'Sobre mi',
      experiencia: 'Experiència',
      formacion: 'Formació',
      habilidades: 'Habilitats',
      proyectos: 'Projectes',
      contacto: 'Contacte'
    },
    hero: {
      contactar: 'Contactar',
      descargarCv: 'Descarregar CV',
      preguntaEtiqueta: "Pregunta'm el que vulguis",
      preguntaEjemplo: 'En què has treballat últimament?',
      preguntar: 'Pregunta'
    },
    chat: {
      titulo: "Pregunta'm",
      intro: 'Pregunta al meu assistent amb IA el que vulguis saber de mi: respon a partir de la meva experiència i els meus projectes.',
      saludo: (nombre: string) => `Hola! Sóc ${nombre}. Pregunta'm el que vulguis sobre la meva experiència, projectes o com contactar-me.`,
      sugerencias: ['A què et dediques?', 'Quines tecnologies fas servir?', "Parla'm dels teus projectes", 'Com et puc contactar?'],
      conversacion: 'Conversa',
      etiqueta: 'Escriu la teva pregunta',
      placeholder: 'Escriu la teva pregunta…',
      enviar: 'Envia',
      escribiendo: 'Escrivint',
      tu: 'Tu',
      errores: {
        limite: 'Massa missatges seguits. Espera un minut.',
        saturado: 'Hi ha molta gent preguntant alhora. Torna-ho a provar en un moment.',
        noDisponible: 'El xat no està disponible ara mateix.'
      }
    },
    contacto: {
      formTitulo: 'Escriu-me',
      nombre: 'Nom',
      email: 'Correu electrònic',
      mensaje: 'Missatge',
      enviar: 'Envia el missatge',
      enviando: 'Enviant…',
      exito: 'Gràcies! He rebut el teu missatge i et respondré aviat.',
      cerrar: 'Tanca',
      errores: {
        requerido: 'Aquest camp és obligatori.',
        email: 'Escriu un correu electrònic vàlid.',
        corto: (min: number) => `Escriu almenys ${min} caràcters.`,
        largo: (max: number) => `Màxim ${max} caràcters.`,
        limite: "Has enviat diversos missatges seguits. Espera uns minuts.",
        noEnviado: (email: string) => `No s'ha pogut enviar. Escriu-me directament a ${email}.`
      }
    },
    tema: { etiqueta: 'Mode fosc', aClaro: 'Canvia a mode clar', aOscuro: 'Canvia a mode fosc' },
    idioma: 'Idioma'
  },

  en: {
    nav: { principal: 'Main', inicio: 'Home' },
    secciones: {
      sobreMi: 'About me',
      experiencia: 'Experience',
      formacion: 'Education',
      habilidades: 'Skills',
      proyectos: 'Projects',
      contacto: 'Contact'
    },
    hero: {
      contactar: 'Get in touch',
      descargarCv: 'Download CV',
      preguntaEtiqueta: 'Ask me anything',
      preguntaEjemplo: 'What have you been working on lately?',
      preguntar: 'Ask'
    },
    chat: {
      titulo: 'Ask me',
      intro: 'Ask my AI assistant anything you want to know about me: it answers based on my experience and projects.',
      saludo: (nombre: string) => `Hi! I'm ${nombre}. Ask me anything about my experience, projects or how to get in touch.`,
      sugerencias: ['What do you do?', 'What technologies do you use?', 'Tell me about your projects', 'How can I contact you?'],
      conversacion: 'Conversation',
      etiqueta: 'Type your question',
      placeholder: 'Type your question…',
      enviar: 'Send',
      escribiendo: 'Typing',
      tu: 'You',
      errores: {
        limite: 'Too many messages in a row. Please wait a minute.',
        saturado: 'Lots of people are asking at once. Try again in a moment.',
        noDisponible: 'The chat is not available right now.'
      }
    },
    contacto: {
      formTitulo: 'Write to me',
      nombre: 'Name',
      email: 'Email',
      mensaje: 'Message',
      enviar: 'Send message',
      enviando: 'Sending…',
      exito: "Thanks! I've received your message and will get back to you soon.",
      cerrar: 'Close',
      errores: {
        requerido: 'This field is required.',
        email: 'Please enter a valid email.',
        corto: (min: number) => `Please write at least ${min} characters.`,
        largo: (max: number) => `${max} characters maximum.`,
        limite: "You've sent several messages in a row. Please wait a few minutes.",
        noEnviado: (email: string) => `The message couldn't be sent. Email me directly at ${email}.`
      }
    },
    tema: { etiqueta: 'Dark mode', aClaro: 'Switch to light mode', aOscuro: 'Switch to dark mode' },
    idioma: 'Language'
  }
};
