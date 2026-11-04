// Respuestas sin IA: se usan si el backend .NET no está disponible
// (p. ej. con "ng serve" sin haber arrancado la API).
// Cada regla se activa si la pregunta contiene alguna de sus palabras clave, en cualquier
// idioma (sin importar mayúsculas ni tildes), y responde en el idioma activo de la web.
// Gana la primera que coincida, así que el orden importa.

import type { Idioma } from '../i18n/textos';

const RESPUESTAS: { claves: string[]; texto: Record<Idioma, string> }[] = [
  {
    claves: ['hola', 'buenas', 'hello', 'hey', 'bon dia', 'good morning'],
    texto: {
      es: '¡Hola! ¿Qué te gustaría saber de mí?',
      ca: 'Hola! Què t\'agradaria saber de mi?',
      en: 'Hi! What would you like to know about me?'
    }
  },
  {
    claves: ['dedicas', 'dediques', 'trabaj', 'treball', 'work', 'job', 'what do you do', 'puesto', 'carrec', 'experien', 'empresa', 'company', 'quien eres', 'qui ets', 'who are you'],
    texto: {
      es: 'Ahora mismo trabajo como [puesto actual] en Empresa S.A. Antes estuve en Otra Empresa, donde [lo que hacías]. Tienes el detalle en la sección Experiencia.',
      ca: 'Ara mateix treballo com a [càrrec actual] a Empresa S.A. Abans vaig ser a Una altra empresa, on [el que feies]. Tens el detall a la secció Experiència.',
      en: 'Right now I work as [current role] at Company Inc. Before that I was at Another Company, where [what you did]. You can find the details in the Experience section.'
    }
  },
  {
    claves: ['tecnolog', 'habilid', 'habilitat', 'skill', 'lenguaje', 'llenguatge', 'programa', 'stack', 'herramienta', 'eina', 'tool', 'angular', '.net', 'python'],
    texto: {
      es: 'Trabajo sobre todo con Angular y TypeScript en el front y C# / .NET en el back, además de SQL, Python y Git. Últimamente estoy muy metido/a en IA generativa.',
      ca: 'Treballo sobretot amb Angular i TypeScript al front i C# / .NET al back, a més de SQL, Python i Git. Últimament estic molt ficat/da en IA generativa.',
      en: "I mainly work with Angular and TypeScript on the front end and C# / .NET on the back end, plus SQL, Python and Git. Lately I've been really into generative AI."
    }
  },
  {
    claves: ['proyect', 'projecte', 'project', 'portfolio', 'github'],
    texto: {
      es: 'Tengo tres proyectos destacados: uno de análisis de datos con Python y Pandas, una web con HTML, CSS y JS, y otro con IA y APIs. Los ves en la sección Proyectos.',
      ca: 'Tinc tres projectes destacats: un d\'anàlisi de dades amb Python i Pandas, una web amb HTML, CSS i JS, i un altre amb IA i APIs. Els tens a la secció Projectes.',
      en: 'I have three featured projects: a data analysis one with Python and Pandas, a website with HTML, CSS and JS, and another with AI and APIs. You can see them in the Projects section.'
    }
  },
  {
    claves: ['estudi', 'study', 'studied', 'formaci', 'universi', 'grado', 'grau', 'degree', 'master', 'curso', 'curs ', 'course'],
    texto: {
      es: 'Estudié [Grado / Máster] en la Universidad de [...] y en 2026 he hecho un curso de Inteligencia Artificial.',
      ca: 'Vaig estudiar [Grau / Màster] a la Universitat de [...] i el 2026 he fet un curs d\'Intel·ligència Artificial.',
      en: "I studied [Bachelor's / Master's] at the University of [...] and in 2026 I took an Artificial Intelligence course."
    }
  },
  {
    claves: ['contact', 'email', 'correo', 'correu', 'mail', 'linkedin', 'hablar', 'parlar', 'escribir', 'escriure', 'reach'],
    texto: {
      es: 'Escríbeme a tu@email.com o por LinkedIn (linkedin.com/in/tu-usuario). Contesto rápido.',
      ca: 'Escriu-me a tu@email.com o per LinkedIn (linkedin.com/in/tu-usuario). Responc ràpid.',
      en: 'Email me at tu@email.com or reach me on LinkedIn (linkedin.com/in/tu-usuario). I reply quickly.'
    }
  },
  {
    claves: ['cv', 'curricul', 'resume'],
    texto: {
      es: 'Puedes descargar mi CV con el botón "Descargar CV" de arriba del todo.',
      ca: 'Pots descarregar el meu CV amb el botó "Descarregar CV" de dalt de tot.',
      en: 'You can download my CV with the "Download CV" button at the top.'
    }
  },
  {
    claves: ['ingles', 'angles', 'english', 'idioma', 'language', 'speak'],
    texto: {
      es: 'Tengo un nivel de inglés B2: lo uso sin problema en documentación y reuniones.',
      ca: 'Tinc un nivell d\'anglès B2: el faig servir sense problema en documentació i reunions.',
      en: 'My English is at B2 level: I use it comfortably for documentation and meetings.'
    }
  },
  {
    claves: ['busc', 'disponib', 'oferta', 'contratar', 'contractar', 'oportunitat', 'oportunidad', 'opportunit', 'hire', 'hiring', 'available'],
    texto: {
      es: 'Estoy abierto/a a nuevas oportunidades donde pueda [lo que buscas]. Si tienes algo en mente, escríbeme.',
      ca: 'Estic obert/a a noves oportunitats on pugui [el que busques]. Si tens alguna cosa al cap, escriu-me.',
      en: "I'm open to new opportunities where I can [what you're looking for]. If you have something in mind, drop me a line."
    }
  },
  {
    claves: ['gracias', 'gracies', 'thank', 'adios', 'adeu', 'bye', 'hasta luego', 'fins aviat', 'chao'],
    texto: {
      es: '¡Gracias a ti por pasarte! Si quieres seguir hablando, ya sabes dónde encontrarme.',
      ca: 'Gràcies a tu per passar-te\'n! Si vols continuar parlant, ja saps on trobar-me.',
      en: 'Thanks for stopping by! If you want to keep talking, you know where to find me.'
    }
  }
];

const POR_DEFECTO: Record<Idioma, string> = {
  es: 'Esa no me la sé responder aquí 😅. Prueba a preguntarme por mi experiencia, tecnologías, proyectos o contacto, o escríbeme a tu@email.com.',
  ca: 'Aquesta no la sé respondre aquí 😅. Prova a preguntar-me per la meva experiència, tecnologies, projectes o contacte, o escriu-me a tu@email.com.',
  en: "I can't answer that one here 😅. Try asking about my experience, technologies, projects or contact details, or email me at tu@email.com."
};

// Minúsculas y sin tildes, para comparar con las claves
function normalizar(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function respuestaOffline(pregunta: string, idioma: Idioma): string {
  const p = normalizar(pregunta) + ' ';
  const regla = RESPUESTAS.find(r => r.claves.some(c => p.includes(c)));
  return regla ? regla.texto[idioma] : POR_DEFECTO[idioma];
}
