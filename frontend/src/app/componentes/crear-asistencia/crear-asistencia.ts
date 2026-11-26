import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Menu } from '../menu/menu';
import { GruposService } from '../../services/grupos-service';
import { SesionesService } from '../../services/sesiones-service';
import { AsistenciaService } from '../../services/asistenciaService';
import { GruposModel } from '../../models/Grupos';
import { SesionesModel } from '../../models/Sesiones';
import { ApiUser } from '../../models/Backend';
import { forkJoin } from 'rxjs';
import { AsistenciaModel } from '../../models/Asistencia';

@Component({
  selector: 'app-crear-asistencia',
  imports: [RouterLink, Menu, FormsModule],
  templateUrl: './crear-asistencia.html',
  styleUrl: './crear-asistencia.css',
})
export class CrearAsistencia implements OnInit {
  private readonly gruposService = inject(GruposService);
  private readonly sesionesService = inject(SesionesService);
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly route = inject(ActivatedRoute);
  protected readonly grupo = signal<GruposModel | null>(null);
  protected readonly sesiones = signal<SesionesModel[]>([]);
  protected readonly usuariosGrupo = signal<ApiUser[]>([]);
  protected readonly selectedSession = signal<number | null>(null);
  protected readonly attendanceStatus = signal<Record<number, number>>({});
  private existingAttendance: AsistenciaModel[] = [];
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly actionMessage = signal('');

  ngOnInit(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id_group'));
    if (!Number.isInteger(groupId) || groupId < 1) { this.loading.set(false); this.errorMessage.set('Grupo inválido.'); return; }
    forkJoin({ group: this.gruposService.getGroupById(groupId), users: this.gruposService.getUsersByGroup(groupId), sessions: this.sesionesService.getSessionsByGroup(groupId) }).subscribe({
      next: ({ group, users, sessions }) => { this.grupo.set(group); this.usuariosGrupo.set(users); this.sesiones.set(sessions.filter((session) => session.status === 1)); this.loading.set(false); },
      error: () => { this.loading.set(false); this.errorMessage.set('No fue posible cargar el grupo, sus estudiantes o sus sesiones.'); },
    });
  }

  protected setSession(value: string): void {
    const id=Number(value)||null; this.selectedSession.set(id); this.existingAttendance=[]; this.attendanceStatus.set({});
    if(!id)return;
    this.asistenciaService.getAttendanceBySession(id).subscribe({next:records=>{this.existingAttendance=records;this.attendanceStatus.set(Object.fromEntries(records.map(r=>[r.user_id,r.status])));},error:()=>this.errorMessage.set('No fue posible cargar la lista de asistencia existente.')});
  }
  protected toggleAttendance(userId: number): void {
    this.attendanceStatus.update((status) => ({ ...status, [userId]: status[userId] === 1 ? 0 : 1 }));
  }
  protected isPresent(userId: number): boolean { return this.attendanceStatus()[userId] === 1; }
  protected saveAttendance(): void {
    const sessionId = this.selectedSession();
    if (!sessionId) { this.errorMessage.set('Selecciona una sesión antes de guardar.'); return; }
    const students = this.usuariosGrupo();
    if (!students.length) { this.errorMessage.set('El grupo todavía no tiene estudiantes inscritos.'); return; }
    const date = new Date().toISOString().slice(0, 10);
    this.saving.set(true); this.errorMessage.set(''); this.actionMessage.set('');
    forkJoin(students.map((student) => { const status=this.attendanceStatus()[student.user_id]??0; const existing=this.existingAttendance.find(record=>record.user_id===student.user_id); return existing ? this.asistenciaService.putAttendance(existing.id,{date,status}) : this.asistenciaService.postAttendance({date,user_id:student.user_id,session_id:sessionId,status}); })).subscribe({
      next: () => { this.saving.set(false); this.actionMessage.set('Asistencia guardada para todos los estudiantes del grupo.'); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.details ?? 'No fue posible guardar la asistencia.'); },
    });
  }
}
