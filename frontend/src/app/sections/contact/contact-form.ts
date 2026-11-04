import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IdiomaService } from '../../i18n/idioma.service';
import { ContactoService, ResultadoEnvio } from './contacto.service';

// Deben coincidir con los límites de backend/Services/ContactoService.cs
const MAX_NOMBRE = 100;
const MAX_EMAIL = 200;
const MIN_MENSAJE = 10;
const MAX_MENSAJE = 2000;

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactForm {
  readonly cerrar = output<void>();

  protected readonly i18n = inject(IdiomaService);
  private readonly contacto = inject(ContactoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly limites = { MAX_NOMBRE, MAX_EMAIL, MIN_MENSAJE, MAX_MENSAJE };
  protected readonly enviando = signal(false);
  protected readonly resultado = signal<ResultadoEnvio | null>(null);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(MAX_NOMBRE)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(MAX_EMAIL)]],
    mensaje: ['', [Validators.required, Validators.minLength(MIN_MENSAJE), Validators.maxLength(MAX_MENSAJE)]],
    sitioWeb: [''] // campo trampa (ver contacto.service.ts)
  });

  protected async enviar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // muestra los errores de todos los campos
      return;
    }
    this.enviando.set(true);
    this.resultado.set(null);

    const resultado = await this.contacto.enviar(this.form.getRawValue());

    this.enviando.set(false);
    this.resultado.set(resultado);
    if (resultado === 'ok') this.form.reset();
  }

  // Tras un envío correcto, vuelve a mostrar el formulario vacío (al reabrir el modal)
  reiniciarSiEnviado(): void {
    if (this.resultado() === 'ok') this.resultado.set(null);
  }

  // Primer error del campo, traducido; null si está bien o aún no se ha tocado
  protected error(campo: AbstractControl): string | null {
    if (!campo.touched || campo.valid) return null;
    const e = this.i18n.t().contacto.errores;
    if (campo.hasError('required')) return e.requerido;
    if (campo.hasError('email')) return e.email;
    if (campo.hasError('minlength')) return e.corto(campo.getError('minlength').requiredLength);
    if (campo.hasError('maxlength')) return e.largo(campo.getError('maxlength').requiredLength);
    return null;
  }
}
