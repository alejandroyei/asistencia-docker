import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { ProgramasService } from '../../services/programas.service';
import { ProgramModel } from '../../models/Backend';

@Component({
  selector: 'app-registrarse',
  imports: [RouterLink],
  templateUrl: './registrarse.html',
  styleUrl: './registrarse.css',
})
export class Registrarse implements OnInit {
  private readonly usuariosApi = inject(UsuariosService);
  private readonly programasApi = inject(ProgramasService);
  private readonly router = inject(Router);
  protected readonly programas = signal<ProgramModel[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  ngOnInit(): void {
    this.programasApi.obtenerTodos().subscribe({
      next: (items) => this.programas.set(items),
      error: () => this.errorMessage.set('No fue posible cargar los programas académicos.'),
    });
  }

  protected registrarse(firstName: string, lastName: string, email: string, phone: string, password: string, confirmation: string, programId: string): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    if (password !== confirmation) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }
    this.loading.set(true);
    this.usuariosApi.crear({
      user_first_name: firstName.trim(), user_last_name: lastName.trim(), user_email: email.trim(),
      user_password: password, user_mobile_phone: phone.trim(), user_role_id: 3,
      user_program_id: Number(programId), user_status_id: 1,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Cuenta creada. Ya puedes iniciar sesión.');
        setTimeout(() => void this.router.navigate(['/auth']), 1200);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.details ?? error.error?.error ?? 'No fue posible crear la cuenta.');
      },
    });
  }
}
