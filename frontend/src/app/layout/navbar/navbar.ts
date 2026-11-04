import { Component, computed, inject } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';
import { LanguageSelect } from '../language-select/language-select';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  imports: [LanguageSelect, ThemeToggle],
  template: `
    <nav [attr.aria-label]="i18n.t().nav.principal">
      <div class="container">
        <a href="#" class="logo" [attr.aria-label]="i18n.t().nav.inicio">{{ i18n.datos().iniciales }}</a>
        <ul>
          @for (enlace of enlaces(); track enlace.id) {
            <li><a [href]="'#' + enlace.id">{{ enlace.texto }}</a></li>
          }
        </ul>
        <app-language-select />
        <app-theme-toggle />
      </div>
    </nav>
  `
})
export class Navbar {
  protected readonly i18n = inject(IdiomaService);
  protected readonly enlaces = computed(() => {
    const s = this.i18n.t().secciones;
    return [
      { id: 'sobre-mi', texto: s.sobreMi },
      { id: 'experiencia', texto: s.experiencia },
      { id: 'proyectos', texto: s.proyectos },
      { id: 'contacto', texto: s.contacto }
    ];
  });
}
