import { Component, input } from '@angular/core';
import { Item } from '../../data/portfolio';

// Lista de puestos o estudios, con las fechas al margen: se usa para Experiencia y para Formación
@Component({
  selector: 'app-timeline',
  template: `
    <section [id]="seccionId()">
      <h2>{{ titulo() }}</h2>
      <div>
        @for (item of items(); track $index) {
          <div class="item">
            <span class="date">{{ item.fechas }}</span>
            <div>
              <h3>{{ item.titulo }}</h3>
              <div class="place">{{ item.lugar }}</div>
              @if (item.puntos?.length) {
                <ul>
                  @for (punto of item.puntos; track punto) {
                    <li>{{ punto }}</li>
                  }
                </ul>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class Timeline {
  readonly seccionId = input.required<string>();
  readonly titulo = input.required<string>();
  readonly items = input.required<Item[]>();
}
