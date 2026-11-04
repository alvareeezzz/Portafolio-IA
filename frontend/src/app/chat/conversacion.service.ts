import { Injectable, inject, signal } from '@angular/core';
import { IdiomaService } from '../i18n/idioma.service';
import { ChatService, MensajeChat } from './chat.service';

export interface Turno {
  autor: 'visitante' | 'yo';
  texto: string;
  escribiendo?: boolean;
}

// Estado de la conversación, compartido entre la portada (que puede iniciarla)
// y la sección del chat (que la muestra).
@Injectable({ providedIn: 'root' })
export class ConversacionService {
  private readonly api = inject(ChatService);
  private readonly i18n = inject(IdiomaService);

  readonly turnos = signal<Turno[]>([]);
  readonly ocupado = signal(false);

  // Lo que se envía a la IA
  private readonly historial: MensajeChat[] = [];

  async preguntar(pregunta: string): Promise<void> {
    const texto = pregunta.trim();
    if (!texto || this.ocupado()) return;
    this.ocupado.set(true);

    this.historial.push({ role: 'user', content: texto });
    this.turnos.update(t => [...t, { autor: 'visitante', texto }, { autor: 'yo', texto: '', escribiendo: true }]);

    const respuesta = await this.api.preguntar(this.historial, this.i18n.idioma());

    this.historial.push({ role: 'assistant', content: respuesta });
    this.turnos.update(t => [...t.slice(0, -1), { autor: 'yo', texto: respuesta }]);
    this.ocupado.set(false);
  }
}
