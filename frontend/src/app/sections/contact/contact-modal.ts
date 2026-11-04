import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';
import { ContactForm } from './contact-form';
import { ContactoModalService } from './contacto-modal.service';

// Modal con <dialog> nativo: showModal() ya mantiene el foco dentro, cierra con Escape
// y oscurece el fondo. El formulario sigue montado al cerrar, así no se pierde lo escrito.
@Component({
  selector: 'app-contact-modal',
  imports: [ContactForm],
  template: `
    <dialog #dialogo aria-labelledby="contacto-modal-titulo" (close)="alCerrar()" (click)="alClicar($event)">
      <div class="contenido">
        <div class="cabecera">
          <h2 id="contacto-modal-titulo">{{ i18n.t().contacto.formTitulo }}</h2>
          <button type="button" class="cerrar" [attr.aria-label]="i18n.t().contacto.cerrar" (click)="dialogo.close()">✕</button>
        </div>
        <app-contact-form (cerrar)="dialogo.close()" />
      </div>
    </dialog>
  `,
  styles: `
    dialog {
      width: calc(100% - 32px); max-width: 520px;
      margin: auto; padding: 0;
      color: var(--text); background: var(--surface);
      border: 1px solid var(--border); border-radius: 12px;
      box-shadow: 0 20px 50px rgb(0 0 0 / 0.3);
    }
    dialog::backdrop { background: rgb(0 0 0 / 0.5); }
    dialog[open] { animation: aparecer 0.15s ease-out; }
    @keyframes aparecer { from { opacity: 0; transform: translateY(8px); } }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }

    .contenido { padding: 20px; }
    .cabecera { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    h2 { font-size: 1.2rem; }
    .cerrar {
      font: inherit; font-size: 1rem; line-height: 1; cursor: pointer;
      width: 32px; height: 32px; border-radius: 8px;
      color: var(--muted); background: transparent; border: 1px solid transparent;
    }
    .cerrar:hover { color: var(--text); border-color: var(--border); }
    .cerrar:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  `
})
export class ContactModal {
  protected readonly i18n = inject(IdiomaService);
  private readonly modal = inject(ContactoModalService);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly formulario = viewChild.required(ContactForm);

  constructor() {
    effect(() => {
      const dialogo = this.dialogo().nativeElement;
      if (this.modal.abierto() && !dialogo.open) dialogo.showModal();
      if (!this.modal.abierto() && dialogo.open) dialogo.close();
    });
  }

  // Se cierra por cualquier vía (✕, Escape, clic fuera): se avisa al servicio
  // y, si ya se envió, la próxima vez se abre el formulario vacío en vez del "¡Gracias!"
  protected alCerrar(): void {
    this.modal.cerrar();
    this.formulario().reiniciarSiEnviado();
  }

  // Un clic directamente sobre el <dialog> (no sobre su contenido) es un clic en el fondo oscuro
  protected alClicar(evento: MouseEvent): void {
    if (evento.target === this.dialogo().nativeElement) this.dialogo().nativeElement.close();
  }
}
