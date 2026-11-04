import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConversacionService } from '../../chat/conversacion.service';
import { IdiomaService } from '../../i18n/idioma.service';
import { ContactoModalService } from '../contact/contacto-modal.service';

// La portada abre con lo que distingue a este portfolio: se le puede preguntar.
// La pregunta inicia la conversación de la sección del chat y lleva hasta ella.
@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  template: `
    @let datos = i18n.datos();
    @let t = i18n.t().hero;
    <header class="container hero">
      <h1>{{ datos.nombre }}</h1>
      <p class="rol">{{ datos.rol }}</p>
      <p class="resumen">{{ datos.resumen }}</p>

      <form class="preguntame" (ngSubmit)="preguntar()" autocomplete="off">
        <label for="hero-pregunta">{{ t.preguntaEtiqueta }}</label>
        <div class="linea">
          <input id="hero-pregunta" name="pregunta" type="text" maxlength="200"
                 [placeholder]="t.preguntaEjemplo" [(ngModel)]="pregunta">
          <button type="submit" class="btn primary" [disabled]="conversacion.ocupado()">{{ t.preguntar }}</button>
        </div>
      </form>

      <div class="acciones">
        <button type="button" class="btn" (click)="modal.abrir()">{{ t.contactar }}</button>
        <a [href]="datos.cv" class="btn">{{ t.descargarCv }}</a>
      </div>
    </header>
  `,
  styles: `
    .hero { padding-block: clamp(56px, 11vw, 120px) clamp(48px, 8vw, 88px); }

    h1 {
      font-size: clamp(2.75rem, 7.5vw, 5.5rem);
      font-weight: 800; line-height: 0.98; letter-spacing: -0.035em;
      max-width: 14ch;
    }
    .rol { font-size: clamp(1.2rem, 2.4vw, 1.6rem); font-weight: 500; margin-top: 18px; letter-spacing: -0.01em; }
    .resumen { color: var(--muted); max-width: 52ch; margin-top: 10px; }

    /* La pregunta es lo más grande después del nombre: es la puerta de entrada */
    .preguntame { margin-top: 44px; max-width: 760px; }
    .preguntame label { display: block; font-weight: 600; margin-bottom: 6px; }
    .linea { display: flex; gap: 14px; align-items: end; }
    .linea input {
      flex: 1; min-width: 0;
      font: inherit; font-size: clamp(1.2rem, 2.6vw, 1.6rem); font-weight: 500; letter-spacing: -0.01em;
      color: var(--text); background: transparent;
      border: 0; border-bottom: 2px solid var(--text); border-radius: 0;
      padding: 8px 2px;
    }
    .linea input::placeholder { color: var(--muted); font-weight: 400; }
    .linea input:focus-visible { outline: none; border-bottom-color: var(--accent); }

    .acciones { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px; }

    /* Único momento animado de la página: la portada entra por partes al cargar */
    h1, .rol, .resumen, .preguntame, .acciones { animation: entrar 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .rol { animation-delay: 0.08s; }
    .resumen { animation-delay: 0.14s; }
    .preguntame { animation-delay: 0.22s; }
    .acciones { animation-delay: 0.3s; }
    @keyframes entrar { from { opacity: 0; transform: translateY(10px); } }

    @media (max-width: 600px) {
      .linea { flex-direction: column; align-items: stretch; }
    }
  `
})
export class Hero {
  protected readonly i18n = inject(IdiomaService);
  protected readonly modal = inject(ContactoModalService);
  protected readonly conversacion = inject(ConversacionService);
  protected pregunta = '';

  protected preguntar(): void {
    const texto = this.pregunta.trim();
    if (!texto) return;
    this.pregunta = '';
    this.conversacion.preguntar(texto);

    // Lleva a la conversación y deja el cursor listo para seguir preguntando
    document.getElementById('chat-input')?.focus({ preventScroll: true });
    document.getElementById('chat')?.scrollIntoView({ block: 'start' });
  }
}
