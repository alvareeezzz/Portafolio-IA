import { Component, inject } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button type="button" role="switch" class="switch"
            [attr.aria-checked]="tema.oscuro()"
            [attr.aria-label]="i18n.t().tema.etiqueta"
            [title]="tema.oscuro() ? i18n.t().tema.aClaro : i18n.t().tema.aOscuro"
            (click)="tema.alternar()">
      <span class="knob" aria-hidden="true">{{ tema.oscuro() ? '🌙' : '☀️' }}</span>
    </button>
  `,
  styles: `
    :host { flex-shrink: 0; display: flex; }
    .switch {
      position: relative; width: 48px; height: 26px; padding: 0;
      border: 1px solid var(--border); border-radius: 999px;
      background: var(--surface); cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
    }
    .switch:hover { border-color: var(--accent); }
    .switch:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .switch[aria-checked="true"] { background: var(--accent); border-color: var(--accent); }
    .knob {
      position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; border-radius: 50%;
      display: grid; place-items: center; font-size: 12px; line-height: 1;
      background: var(--bg);
      transition: transform 0.2s;
    }
    .switch[aria-checked="true"] .knob { transform: translateX(22px); }
    @media (prefers-reduced-motion: reduce) {
      .switch, .knob { transition: none; }
    }
  `
})
export class ThemeToggle {
  protected readonly tema = inject(ThemeService);
  protected readonly i18n = inject(IdiomaService);
}
