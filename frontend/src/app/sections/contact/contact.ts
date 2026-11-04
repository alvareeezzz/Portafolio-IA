import { Component, inject } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';
import { ContactoModalService } from './contacto-modal.service';

@Component({
  selector: 'app-contact',
  template: `
    @let c = i18n.datos().contacto;
    <section id="contacto">
      <h2>{{ i18n.t().secciones.contacto }}</h2>
      <div>
        <a class="email" [href]="'mailto:' + c.email">{{ c.email }}</a>
        <ul class="enlaces">
          <li><a [href]="c.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a [href]="c.github" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li>{{ c.ubicacion }}</li>
        </ul>
        <button type="button" class="btn primary" (click)="modal.abrir()">{{ i18n.t().contacto.formTitulo }}</button>
      </div>
    </section>
  `,
  styles: `
    .email {
      display: inline-block;
      font-size: clamp(1.5rem, 4vw, 2.4rem); font-weight: 700; letter-spacing: -0.02em;
      color: var(--text); text-decoration-color: var(--accent); text-decoration-thickness: 2px;
    }
    .email:hover { color: var(--accent); }
    .enlaces { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 24px; margin-top: 14px; color: var(--muted); }
    .btn { margin-top: 28px; }
  `
})
export class Contact {
  protected readonly i18n = inject(IdiomaService);
  protected readonly modal = inject(ContactoModalService);
}
