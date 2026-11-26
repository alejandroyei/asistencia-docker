import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menu } from '../menu/menu';
import { UsuariosService } from '../../services/usuarios.service';
import { GruposService } from '../../services/grupos-service';
import { InscripcionesService } from '../../services/inscripciones-service';
import { ApiUser, RegistrationModel } from '../../models/Backend';
import { GruposModel } from '../../models/Grupos';

interface AsignacionFila { id: number; alumno: string; grupo: string; fecha: string; }

@Component({
  selector: 'app-asignar-alumno',
  imports: [FormsModule, Menu],
  templateUrl: './asignar-alumno.html',
  styleUrl: './asignar-alumno.css',
})
export class AsignarAlumno implements OnInit {
  private readonly usersApi = inject(UsuariosService);
  private readonly gruposApi = inject(GruposService);
  private readonly inscripcionesApi = inject(InscripcionesService);
  protected readonly alumnos = signal<ApiUser[]>([]);
  protected readonly grupos = signal<GruposModel[]>([]);
  protected readonly asignaciones = signal<AsignacionFila[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly search = signal('');
  protected readonly selectedAlumno = signal<number | null>(null);
  protected readonly selectedGrupo = signal<number | null>(null);
  protected readonly actionMessage = signal('');
  protected readonly errorMsg = signal('');

  protected readonly filteredAlumnos = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.alumnos().filter((a) => `${a.user_first_name} ${a.user_last_name} ${a.user_email}`.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.usersApi.obtenerPorRol(3).subscribe({ next: (items) => this.alumnos.set(items), error: () => this.errorMsg.set('No fue posible cargar los alumnos.') });
    this.gruposApi.getGroups().subscribe({ next: (items) => { this.grupos.set(items.filter((g) => g.status_group === 1)); this.loading.set(false); }, error: () => { this.loading.set(false); this.errorMsg.set('No fue posible cargar los grupos.'); } });
    this.loadAssignments();
  }

  private loadAssignments(): void {
    this.inscripcionesApi.obtenerTodas().subscribe({
      next: (registrations) => this.setAssignments(registrations),
      error: () => this.errorMsg.set('No fue posible cargar el historial de inscripciones.'),
    });
  }
  private setAssignments(registrations: RegistrationModel[]): void {
    const users = this.alumnos();
    const groups = this.grupos();
    this.asignaciones.set(registrations.filter((r) => r.status === 1).map((r) => ({
      id: r.id,
      alumno: users.find((u) => u.user_id === r.users)?.user_first_name + ' ' + (users.find((u) => u.user_id === r.users)?.user_last_name ?? '') || `Usuario ${r.users}`,
      grupo: groups.find((g) => g.id_group === r.groups)?.access_code_group ?? `Grupo ${r.groups}`,
      fecha: 'Inscripción activa',
    })));
  }
  protected onSearch(value: string): void { this.search.set(value); this.selectedAlumno.set(null); }
  protected asignar(): void {
    const userId = this.selectedAlumno(); const groupId = this.selectedGrupo();
    if (userId === null || groupId === null) { this.errorMsg.set('Selecciona un alumno y un grupo.'); return; }
    this.saving.set(true); this.errorMsg.set(''); this.actionMessage.set('');
    this.inscripcionesApi.crear({ users: userId, groups: groupId, status: 1 }).subscribe({
      next: () => { this.saving.set(false); this.actionMessage.set('Alumno asignado correctamente.'); this.selectedAlumno.set(null); this.selectedGrupo.set(null); this.loadAssignments(); },
      error: (error) => { this.saving.set(false); this.errorMsg.set(error.error?.error ?? 'No fue posible asignar al alumno.'); },
    });
  }
}
