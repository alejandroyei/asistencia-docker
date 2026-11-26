import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../menu/menu';
import { GruposService } from '../../services/grupos-service';
import { SesionesService } from '../../services/sesiones-service';
import { GruposModel } from '../../models/Grupos';

@Component({
  selector: 'app-crear-sesion',
  imports: [RouterLink, Menu],
  templateUrl: './crear-sesion.html',
  styleUrl: './crear-sesion.css',
})
export class CrearSesion implements OnInit {
  private readonly gruposApi = inject(GruposService);
  private readonly sesionesApi = inject(SesionesService);
  protected readonly grupos = signal<GruposModel[]>([]);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly actionMessage = signal('');

  ngOnInit(): void {
    this.gruposApi.getGroups().subscribe({
      next: (items) => this.grupos.set(items.filter((group) => group.status_group === 1)),
      error: () => this.errorMessage.set('No fue posible cargar los grupos.'),
    });
  }

  protected crearSesion(date: string, groupId: string): void {
    if (!date || !groupId) { this.errorMessage.set('Selecciona una fecha y un grupo.'); return; }
    const dateValue = new Date(`${date}T00:00:00`);
    this.saving.set(true); this.errorMessage.set(''); this.actionMessage.set('');
    this.sesionesApi.postSessions({ date, day: dateValue.getDay(), id_group: Number(groupId), status: 1 }).subscribe({
      next: () => { this.saving.set(false); this.actionMessage.set('Sesión creada correctamente.'); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.details ?? error.error?.error ?? 'No fue posible crear la sesión.'); },
    });
  }
}
