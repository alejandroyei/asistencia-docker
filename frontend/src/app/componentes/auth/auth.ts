import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected iniciarSesion(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        const role = this.auth.usuario()?.rol;
        void this.router.navigate([role === 'alumno' ? '/asistencia' : role === 'docente' ? '/grupos' : '/usuarios']);
      },
      error: (error: { error?: { error?: string } }) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error ?? 'No fue posible iniciar sesión. Verifica tus credenciales.');
      },
    });
  }

}
