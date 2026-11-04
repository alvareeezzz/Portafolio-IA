import { Component, input } from '@angular/core';
import type { Idioma } from '../../i18n/textos';

// Banderas en SVG (los emojis de bandera no se ven en Windows y la senyera no existe como emoji).
// Cada una usa su proporción real y se recorta para llenar el mismo hueco.
@Component({
  selector: 'app-bandera',
  template: `
    @switch (idioma()) {
      @case ('es') {
        <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="3" height="2" fill="#AA151B" />
          <rect y="0.5" width="3" height="1" fill="#F1BF00" />
        </svg>
      }
      @case ('ca') {
        <svg viewBox="0 0 27 18" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="27" height="18" fill="#FCDD09" />
          <path d="M0 3h27M0 7h27M0 11h27M0 15h27" stroke="#DA121A" stroke-width="2" />
        </svg>
      }
      @case ('en') {
        <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <clipPath id="bandera-uk-diagonales">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
          </clipPath>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#bandera-uk-diagonales)" stroke="#C8102E" stroke-width="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
        </svg>
      }
    }
  `,
  styles: `
    :host {
      display: block; width: 24px; height: 16px; flex-shrink: 0;
      border-radius: 3px; overflow: hidden;
      box-shadow: 0 0 0 1px var(--border); /* para que se vean sobre cualquier fondo */
    }
    svg { display: block; width: 100%; height: 100%; }
  `
})
export class Bandera {
  readonly idioma = input.required<Idioma>();
}
