import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { TEXTOS, type Idioma } from '../i18n/textos';
import { respuestaOffline } from './respuestas-offline';

// Mismo formato que backend/Models/ChatModels.cs
export interface MensajeChat {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_TURNOS = 20; // debe coincidir con Chat:MaxTurnos en backend/appsettings.json

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  // Envía la conversación y el idioma de la web a la API .NET (/api/chat), que es quien habla con Claude.
  // Si la API responde con un error propio (límite, IA caída…) se avisa en el idioma de la web;
  // si la API no está disponible, responde el modo sin IA.
  async preguntar(historial: MensajeChat[], idioma: Idioma): Promise<string> {
    if (!environment.conBackend) return respuestaOffline(historial[historial.length - 1].content, idioma);

    try {
      const { respuesta } = await firstValueFrom(
        this.http.post<{ respuesta: string }>('/api/chat', { mensajes: historial.slice(-(MAX_TURNOS - 1)), idioma })
      );
      return respuesta;
    } catch (error) {
      // La API siempre responde {"error": "..."}; si no llega eso, no hay API detrás
      const esDeLaApi = error instanceof HttpErrorResponse && typeof error.error?.error === 'string';
      if (!esDeLaApi) return respuestaOffline(historial[historial.length - 1].content, idioma);

      const errores = TEXTOS[idioma].chat.errores;
      if (error.status === 429) return errores.limite;
      if (error.status === 503) return errores.saturado;
      return errores.noDisponible;
    }
  }
}
