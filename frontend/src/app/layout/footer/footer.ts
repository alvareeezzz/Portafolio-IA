import { Component, inject } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';

@Component({
  selector: 'app-footer',
  template: `<footer><div class="container">© {{ anio }} {{ i18n.datos().nombre }}</div></footer>`
})
export class Footer {
  protected readonly anio = new Date().getFullYear();
  protected readonly i18n = inject(IdiomaService);
}
