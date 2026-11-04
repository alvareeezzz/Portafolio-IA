import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IdiomaService } from '../../i18n/idioma.service';

// Abre y cierra el modal de contacto desde cualquier componente (hero, sección Contacto…)
@Injectable({ providedIn: 'root' })
export class ContactoModalService {
  private readonly i18n = inject(IdiomaService);
  readonly abierto = signal(false);

  abrir(): void {
    // Sin API (GitHub Pages) el formulario no podría enviarse: se abre el correo del visitante
    if (!environment.conBackend) {
      window.location.href = `mailto:${this.i18n.datos().contacto.email}`;
      return;
    }
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
  }
}
