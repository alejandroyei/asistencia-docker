import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Menu } from '../menu/menu';
import { UsuariosService } from '../../services/usuarios.service';
import { RolesService } from '../../services/roles.service';
import { ProgramasService } from '../../services/programas.service';
import { ApiUser, ProgramModel, RoleModel } from '../../models/Backend';

@Component({
  selector: 'app-usuarios',
  imports: [Menu],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private readonly usuariosApi = inject(UsuariosService);
  private readonly rolesApi = inject(RolesService);
  private readonly programasApi = inject(ProgramasService);

  protected readonly usuarios = signal<ApiUser[]>([]);
  protected readonly roles = signal<RoleModel[]>([]);
  protected readonly programas = signal<ProgramModel[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly search = signal('');
  protected readonly selectedId = signal<number | null>(null);
  protected readonly editingId = signal<number | null>(null);
  protected readonly creating = signal(false);
  protected readonly confirmingDelete = signal(false);
  protected readonly actionMessage = signal('');

  protected readonly filteredUsuarios = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.usuarios().filter((user) =>
      `${user.user_first_name} ${user.user_last_name} ${user.user_email}`.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadUsers();
    this.rolesApi.obtenerTodos().subscribe({ next: (data) => this.roles.set(data), error: () => this.errorMessage.set('No fue posible cargar los roles.') });
    this.programasApi.obtenerTodos().subscribe({ next: (data) => this.programas.set(data), error: () => this.errorMessage.set('No fue posible cargar los programas.') });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.usuariosApi.obtenerTodos().subscribe({
      next: (data) => { this.usuarios.set(data); this.loading.set(false); this.errorMessage.set(''); },
      error: () => { this.loading.set(false); this.errorMessage.set('No fue posible cargar los usuarios. Inicia sesión y vuelve a intentarlo.'); },
    });
  }

  protected onSearch(value: string): void { this.search.set(value); this.selectedId.set(null); }
  protected selectUsuario(id: number): void { this.selectedId.set(id); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected addUsuario(): void { this.creating.set(true); this.editingId.set(null); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected editSelected(): void { this.editingId.set(this.selectedId()); this.actionMessage.set(''); }
  protected cancelEdit(): void { this.editingId.set(null); }
  protected cancelCreate(): void { this.creating.set(false); }

  protected createUsuario(firstName: string, lastName: string, email: string, password: string, phone: string, roleId: string, programId: string): void {
    this.saving.set(true);
    this.errorMessage.set('');
    this.usuariosApi.crear({
      user_first_name: firstName.trim(), user_last_name: lastName.trim(), user_email: email.trim(),
      user_password: password, user_mobile_phone: phone.trim(), user_role_id: Number(roleId),
      user_program_id: Number(programId), user_status_id: 1,
    }).subscribe({
      next: () => { this.saving.set(false); this.creating.set(false); this.actionMessage.set('Usuario creado correctamente.'); this.loadUsers(); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.details ?? 'No fue posible crear el usuario.'); },
    });
  }

  protected saveUsuario(id: number, firstName: string, lastName: string, email: string, roleId: string, programId: string): void {
    this.saving.set(true);
    this.errorMessage.set('');
    this.usuariosApi.actualizar(id, {
      user_first_name: firstName.trim(), user_last_name: lastName.trim(), user_email: email.trim(),
      user_role_id: Number(roleId), user_program_id: Number(programId),
    }).subscribe({
      next: () => { this.saving.set(false); this.editingId.set(null); this.actionMessage.set('Usuario actualizado correctamente.'); this.loadUsers(); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.error ?? 'No fue posible actualizar el usuario.'); },
    });
  }

  protected deleteSelected(): void { this.confirmingDelete.set(true); }
  protected cancelDelete(): void { this.confirmingDelete.set(false); }
  protected confirmDelete(): void {
    const id = this.selectedId();
    if (id === null) return;
    this.usuariosApi.eliminar(id).subscribe({
      next: () => { this.selectedId.set(null); this.confirmingDelete.set(false); this.actionMessage.set('Usuario desactivado correctamente.'); this.loadUsers(); },
      error: () => this.errorMessage.set('No fue posible desactivar el usuario.'),
    });
  }

  protected getRolNombre(id: number): string { return this.roles().find((role) => role.id_role === id)?.name_role ?? 'Desconocido'; }
  protected getProgramaNombre(id: number): string { return this.programas().find((program) => program.id === id)?.name ?? 'Sin programa'; }
  protected getEstadoNombre(id: number): string { return id === 1 ? 'Activo' : 'Inactivo'; }
}
