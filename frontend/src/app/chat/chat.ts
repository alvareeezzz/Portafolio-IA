import { Component, ElementRef, afterRenderEffect, computed, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IdiomaService } from '../i18n/idioma.service';
import { ConversacionService } from './conversacion.service';

// La conversación se muestra como la transcripción de una entrevista:
// las preguntas del visitante, subrayadas con rotulador; las respuestas, en texto limpio.
@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  protected readonly i18n = inject(IdiomaService);
  protected readonly conversacion = inject(ConversacionService);
  private readonly log = viewChild.required<ElementRef<HTMLElement>>('log');

  protected readonly miNombre = computed(() => this.i18n.datos().nombre.split(' ')[0]);
  protected pregunta = '';

  constructor() {
    // Cada vez que cambia la conversación, baja hasta el último turno
    afterRenderEffect(() => {
      this.conversacion.turnos();
      const el = this.log().nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }

  protected enviar(): void {
    const texto = this.pregunta;
    this.pregunta = '';
    this.conversacion.preguntar(texto);
  }
}
