import { Injectable, signal } from '@angular/core';

// Abre y cierra el modal de contacto desde cualquier componente (hero, sección Contacto…)
@Injectable({ providedIn: 'root' })
export class ContactoModalService {
  readonly abierto = signal(false);

  abrir(): void {
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
  }
}
