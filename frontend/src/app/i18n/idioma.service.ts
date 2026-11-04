import { Injectable, computed, effect, signal } from '@angular/core';
import { PORTFOLIO } from '../data/portfolio';
import { IDIOMAS, Idioma, TEXTOS } from './textos';

const CLAVE = 'idioma';

function esIdioma(valor: string | null): valor is Idioma {
  return IDIOMAS.some(i => i.codigo === valor);
}

// Idioma activo. Los componentes leen t() (textos de la interfaz) y datos() (tu contenido),
// así que al cambiar de idioma toda la web se actualiza sola.
@Injectable({ providedIn: 'root' })
export class IdiomaService {
  readonly idioma = signal<Idioma>(this.idiomaInicial());
  readonly t = computed(() => TEXTOS[this.idioma()]);
  readonly datos = computed(() => PORTFOLIO[this.idioma()]);

  constructor() {
    effect(() => {
      document.documentElement.lang = this.idioma();
      document.title = `${this.datos().nombre} · Portfolio`;
    });
  }

  cambiar(idioma: string): void {
    if (!esIdioma(idioma)) return;
    this.idioma.set(idioma);
    // localStorage puede no estar disponible (modo privado, cookies bloqueadas)
    try {
      localStorage.setItem(CLAVE, idioma);
    } catch {}
  }

  // Elección guardada → idioma del navegador → español
  private idiomaInicial(): Idioma {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (esIdioma(guardado)) return guardado;
    } catch {}
    const navegador = navigator.language.slice(0, 2);
    return esIdioma(navegador) ? navegador : 'es';
  }
}
