import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// Mismo formato que backend/Models/ContactoModels.cs
export interface MensajeContacto {
  nombre: string;
  email: string;
  mensaje: string;
  sitioWeb: string; // campo trampa para bots: siempre vacío si lo rellena una persona
}

export type ResultadoEnvio = 'ok' | 'limite' | 'error';

@Injectable({ providedIn: 'root' })
export class ContactoService {
  private readonly http = inject(HttpClient);

  // Envía el formulario a la API .NET (/api/contacto), que te lo reenvía por email
  async enviar(datos: MensajeContacto): Promise<ResultadoEnvio> {
    try {
      await firstValueFrom(this.http.post('/api/contacto', datos));
      return 'ok';
    } catch (error) {
      return error instanceof HttpErrorResponse && error.status === 429 ? 'limite' : 'error';
    }
  }
}
