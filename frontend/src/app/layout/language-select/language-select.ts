import { Component, ElementRef, computed, inject, signal, viewChild, viewChildren } from '@angular/core';
import { IdiomaService } from '../../i18n/idioma.service';
import { IDIOMAS, Idioma } from '../../i18n/textos';
import { Bandera } from './bandera';

// Desplegable propio (no <select>): las opciones de un <select> solo admiten texto, no banderas.
// Teclado: ↓/↑ para moverse, Enter o Espacio para elegir, Escape para cerrar.
@Component({
  selector: 'app-language-select',
  imports: [Bandera],
  host: {
    '(document:click)': 'alClicarFuera($event)',
    '(keydown.escape)': 'cerrar(true)'
  },
  template: `
    <button #boton type="button" class="actual"
            aria-haspopup="listbox" [attr.aria-expanded]="abierto()"
            [attr.aria-label]="i18n.t().idioma + ': ' + nombreActual()" [title]="nombreActual()"
            (click)="alternar()" (keydown.arrowdown)="abrir($event)">
      <app-bandera [idioma]="i18n.idioma()" />
      <span class="flecha" aria-hidden="true">▾</span>
    </button>

    @if (abierto()) {
      <ul role="listbox" [attr.aria-label]="i18n.t().idioma"
          (keydown.arrowdown)="mover(1, $event)" (keydown.arrowup)="mover(-1, $event)">
        @for (op of idiomas; track op.codigo) {
          <li #opcion role="option" tabindex="-1" [title]="op.nombre" [attr.lang]="op.codigo"
              [attr.aria-label]="op.nombre" [attr.aria-selected]="op.codigo === i18n.idioma()"
              (click)="elegir(op.codigo)" (keydown.enter)="elegir(op.codigo)" (keydown.space)="elegir(op.codigo); $event.preventDefault()">
            <app-bandera [idioma]="op.codigo" />
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host { position: relative; flex-shrink: 0; display: flex; }
    .actual {
      display: flex; align-items: center; gap: 4px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 4px 6px; cursor: pointer; color: var(--muted);
    }
    .actual:hover, .actual[aria-expanded="true"] { border-color: var(--accent); }
    .flecha { font-size: 0.7rem; line-height: 1; }
    ul {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 20;
      list-style: none; padding: 4px; display: grid; gap: 2px;
      background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
      box-shadow: 0 6px 20px rgb(0 0 0 / 0.15);
    }
    li { padding: 6px 8px; border-radius: 6px; cursor: pointer; }
    li:hover, li:focus { background: var(--bg); outline: none; }
    li[aria-selected="true"] { box-shadow: inset 0 0 0 2px var(--accent); }
    .actual:focus-visible, li:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  `
})
export class LanguageSelect {
  protected readonly i18n = inject(IdiomaService);
  protected readonly idiomas = IDIOMAS;
  protected readonly abierto = signal(false);
  protected readonly nombreActual = computed(() => IDIOMAS.find(i => i.codigo === this.i18n.idioma())!.nombre);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly boton = viewChild.required<ElementRef<HTMLButtonElement>>('boton');
  private readonly opciones = viewChildren<ElementRef<HTMLLIElement>>('opcion');

  protected alternar(): void {
    if (this.abierto()) {
      this.cerrar(false);
    } else {
      this.abrir();
    }
  }

  // Abre la lista y pone el foco en el idioma activo
  protected abrir(evento?: Event): void {
    evento?.preventDefault();
    this.abierto.set(true);
    setTimeout(() => this.enfocar(IDIOMAS.findIndex(i => i.codigo === this.i18n.idioma())));
  }

  protected cerrar(devolverFoco: boolean): void {
    if (!this.abierto()) return;
    this.abierto.set(false);
    if (devolverFoco) this.boton().nativeElement.focus();
  }

  protected elegir(idioma: Idioma): void {
    this.i18n.cambiar(idioma);
    this.cerrar(true);
  }

  protected mover(paso: number, evento: Event): void {
    evento.preventDefault();
    const actual = this.opciones().findIndex(o => o.nativeElement === document.activeElement);
    this.enfocar((actual + paso + IDIOMAS.length) % IDIOMAS.length);
  }

  protected alClicarFuera(evento: MouseEvent): void {
    if (!this.host.nativeElement.contains(evento.target as Node)) this.cerrar(false);
  }

  private enfocar(indice: number): void {
    this.opciones()[indice]?.nativeElement.focus();
  }
}
