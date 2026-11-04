import { Injectable, effect, signal } from '@angular/core';

const CLAVE = 'tema';

// Tema claro/oscuro. Pone data-theme en <html>, que es lo que lee styles.css.
// Si el visitante nunca ha tocado el interruptor, se sigue el tema del sistema.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly oscuro = signal(this.temaInicial());

  constructor() {
    effect(() => {
      document.documentElement.dataset['theme'] = this.oscuro() ? 'dark' : 'light';
    });
  }

  alternar(): void {
    this.oscuro.update(v => !v);
    // localStorage puede no estar disponible (modo privado, cookies bloqueadas)
    try {
      localStorage.setItem(CLAVE, this.oscuro() ? 'dark' : 'light');
    } catch {}
  }

  private temaInicial(): boolean {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) return guardado === 'dark';
    } catch {}
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
