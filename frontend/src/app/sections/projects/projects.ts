import { Component, inject } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';

@Component({
  selector: 'app-projects',
  template: `
    <section id="proyectos">
      <h2>{{ i18n.t().secciones.proyectos }}</h2>
      <ul class="proyectos">
        @for (proyecto of i18n.datos().proyectos; track $index) {
          <li class="proyecto">
            <h3>
              @if (proyecto.enlace) {
                <a [href]="proyecto.enlace" target="_blank" rel="noopener noreferrer">{{ proyecto.titulo }}</a>
              } @else {
                {{ proyecto.titulo }}
              }
            </h3>
            <p>{{ proyecto.descripcion }}</p>
            <p class="tags">{{ proyecto.tags.join(', ') }}</p>
          </li>
        }
      </ul>
    </section>
  `
})
export class Projects {
  protected readonly i18n = inject(IdiomaService);
}
