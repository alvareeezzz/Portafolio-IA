// Contenido de la web en cada idioma: edita aquí tus datos y las secciones se actualizan solas.
// Lo que no cambia con el idioma (nombre, enlaces…) va en COMUN.
// (Lo que sabe el chat con IA está aparte, en backend/Data/perfil.md)

import type { Idioma } from '../i18n/textos';

export interface Item {
  titulo: string;
  fechas: string;
  lugar: string;
  puntos?: string[];
}

export interface Proyecto {
  titulo: string;
  descripcion: string;
  tags: string[];
  enlace?: string;
}

export interface Portfolio {
  nombre: string;
  iniciales: string;
  cv: string;
  rol: string;
  resumen: string;
  sobreMi: string;
  experiencia: Item[];
  formacion: Item[];
  habilidades: string[];
  proyectos: Proyecto[];
  contacto: { email: string; linkedin: string; github: string; ubicacion: string };
}

const COMUN = {
  nombre: 'Tu Nombre Apellido',
  iniciales: 'TN',
  cv: 'assets/cv.pdf',
  email: 'tu@email.com',
  linkedin: 'https://www.linkedin.com/in/tu-usuario',
  github: 'https://github.com/tu-usuario',
  tecnologias: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'C# / .NET', 'Python', 'SQL', 'Git']
};

const { email, linkedin, github, tecnologias, ...basicos } = COMUN;

export const PORTFOLIO: Record<Idioma, Portfolio> = {
  es: {
    ...basicos,
    rol: 'Desarrollo web y análisis de datos',
    resumen: 'Breve frase sobre quién eres, en qué te especializas y qué te motiva. Dos líneas como mucho.',
    sobreMi: 'Aquí puedes contar un poco más: tu trayectoria, qué tipo de proyectos te interesan, cómo trabajas y qué buscas ahora mismo. Mantenlo en un párrafo o dos.',
    experiencia: [
      {
        titulo: 'Puesto actual',
        fechas: '2023 – Actualidad',
        lugar: 'Empresa S.A., Ciudad',
        puntos: ['Logro o responsabilidad principal con algún dato concreto.', 'Otra tarea relevante o tecnología utilizada.']
      },
      {
        titulo: 'Puesto anterior',
        fechas: '2020 – 2023',
        lugar: 'Otra Empresa, Ciudad',
        puntos: ['Descripción breve de lo que hacías.', 'Resultado o aprendizaje destacado.']
      }
    ],
    formacion: [
      { titulo: 'Grado / Máster en ...', fechas: '2016 – 2020', lugar: 'Universidad de ...' },
      { titulo: 'Curso de Inteligencia Artificial', fechas: '2026', lugar: 'Centro de formación' }
    ],
    habilidades: [...tecnologias, 'IA generativa', 'Inglés B2'],
    proyectos: [
      { titulo: 'Proyecto uno', descripcion: 'Qué problema resuelve y qué hiciste tú.', tags: ['Python', 'Pandas'] },
      { titulo: 'Proyecto dos', descripcion: 'Breve descripción del proyecto y su resultado.', tags: ['HTML', 'CSS', 'JS'] },
      { titulo: 'Proyecto tres', descripcion: 'Otro trabajo del que estés orgulloso/a.', tags: ['IA', 'API'] }
    ],
    contacto: { email, linkedin, github, ubicacion: 'Ciudad, País' }
  },

  ca: {
    ...basicos,
    rol: 'Desenvolupament web i anàlisi de dades',
    resumen: "Breu frase sobre qui ets, en què t'especialitzes i què et motiva. Dues línies com a màxim.",
    sobreMi: "Aquí pots explicar una mica més: la teva trajectòria, quin tipus de projectes t'interessen, com treballes i què busques ara mateix. Mantén-ho en un o dos paràgrafs.",
    experiencia: [
      {
        titulo: 'Càrrec actual',
        fechas: '2023 – Actualitat',
        lugar: 'Empresa S.A., Ciutat',
        puntos: ['Assoliment o responsabilitat principal amb alguna dada concreta.', 'Una altra tasca rellevant o tecnologia utilitzada.']
      },
      {
        titulo: 'Càrrec anterior',
        fechas: '2020 – 2023',
        lugar: 'Una altra empresa, Ciutat',
        puntos: ['Descripció breu del que feies.', 'Resultat o aprenentatge destacat.']
      }
    ],
    formacion: [
      { titulo: 'Grau / Màster en ...', fechas: '2016 – 2020', lugar: 'Universitat de ...' },
      { titulo: "Curs d'Intel·ligència Artificial", fechas: '2026', lugar: 'Centre de formació' }
    ],
    habilidades: [...tecnologias, 'IA generativa', 'Anglès B2'],
    proyectos: [
      { titulo: 'Projecte u', descripcion: 'Quin problema resol i què hi vas fer tu.', tags: ['Python', 'Pandas'] },
      { titulo: 'Projecte dos', descripcion: 'Breu descripció del projecte i el seu resultat.', tags: ['HTML', 'CSS', 'JS'] },
      { titulo: 'Projecte tres', descripcion: "Un altre treball del qual estiguis orgullós/osa.", tags: ['IA', 'API'] }
    ],
    contacto: { email, linkedin, github, ubicacion: 'Ciutat, País' }
  },

  en: {
    ...basicos,
    rol: 'Web development and data analysis',
    resumen: 'A short sentence about who you are, what you specialise in and what drives you. Two lines at most.',
    sobreMi: 'Here you can tell a bit more: your background, the kind of projects you enjoy, how you work and what you are looking for right now. Keep it to one or two paragraphs.',
    experiencia: [
      {
        titulo: 'Current role',
        fechas: '2023 – Present',
        lugar: 'Company Inc., City',
        puntos: ['Main achievement or responsibility, with a concrete figure.', 'Another relevant task or technology used.']
      },
      {
        titulo: 'Previous role',
        fechas: '2020 – 2023',
        lugar: 'Another Company, City',
        puntos: ['Short description of what you did.', 'Notable result or lesson learned.']
      }
    ],
    formacion: [
      { titulo: "Bachelor's / Master's in ...", fechas: '2016 – 2020', lugar: 'University of ...' },
      { titulo: 'Artificial Intelligence Course', fechas: '2026', lugar: 'Training centre' }
    ],
    habilidades: [...tecnologias, 'Generative AI', 'English B2'],
    proyectos: [
      { titulo: 'Project one', descripcion: 'What problem it solves and what you did.', tags: ['Python', 'Pandas'] },
      { titulo: 'Project two', descripcion: 'Short description of the project and its outcome.', tags: ['HTML', 'CSS', 'JS'] },
      { titulo: 'Project three', descripcion: 'Another piece of work you are proud of.', tags: ['AI', 'API'] }
    ],
    contacto: { email, linkedin, github, ubicacion: 'City, Country' }
  }
};
