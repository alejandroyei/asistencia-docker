import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Menu } from '../menu/menu';
import { GruposService } from '../../services/grupos-service';
import { MateriasService } from '../../services/materias.service';
import { ProgramasService } from '../../services/programas.service';
import { PromocionesService } from '../../services/promociones.service';
import { GruposModel } from '../../models/Grupos';
import { ProgramModel, PromotionModel, SubjectModel } from '../../models/Backend';

@Component({
  selector: 'app-grupos',
  imports: [Menu],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css',
})
export class Grupos implements OnInit {
  private readonly api = inject(GruposService);
  private readonly materiasApi = inject(MateriasService);
  private readonly programasApi = inject(ProgramasService);
  private readonly promocionesApi = inject(PromocionesService);

  protected readonly grupos = signal<GruposModel[]>([]);
  protected readonly materias = signal<SubjectModel[]>([]);
  protected readonly programas = signal<ProgramModel[]>([]);
  protected readonly promociones = signal<PromotionModel[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly search = signal('');
  protected readonly selectedId = signal<number | null>(null);
  protected readonly editingId = signal<number | null>(null);
  protected readonly creating = signal(false);
  protected readonly confirmingDelete = signal(false);
  protected readonly actionMessage = signal('');
  protected readonly showQrModal = signal(false);
  protected readonly qrDataUrl = signal('');
  protected readonly selectedProgramId = signal<number | null>(null);

  protected readonly filteredGroups = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.grupos().filter((group) =>
      `${group.access_code_group} ${group.subjects?.name_subjects ?? ''} ${group.promotion?.name_promotion ?? ''} ${group.programs?.name ?? ''}`
        .toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadGroups();
    this.materiasApi.obtenerTodas().subscribe({ next: (data) => this.materias.set(data), error: () => this.errorMessage.set('No fue posible cargar las materias.') });
    this.programasApi.obtenerTodos().subscribe({ next: (data) => this.programas.set(data), error: () => this.errorMessage.set('No fue posible cargar los programas.') });
    this.promocionesApi.obtenerTodas().subscribe({ next: (data) => this.promociones.set(data), error: () => this.errorMessage.set('No fue posible cargar las promociones.') });
  }

  private loadGroups(): void {
    this.loading.set(true);
    this.api.getGroups().subscribe({
      next: (data) => { this.grupos.set(data); this.loading.set(false); this.errorMessage.set(''); },
      error: () => { this.loading.set(false); this.errorMessage.set('No fue posible cargar los grupos.'); },
    });
  }

  protected onSearch(value: string): void { this.search.set(value); this.selectedId.set(null); }
  protected selectGrupo(id: number): void { this.selectedId.set(id); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected addGrupo(): void { this.creating.set(true); this.editingId.set(null); this.selectedProgramId.set(null); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected editSelected(): void {
    const group = this.grupos().find((item) => item.id_group === this.selectedId());
    this.selectedProgramId.set(group?.id_programs ?? null);
    this.editingId.set(this.selectedId()); this.actionMessage.set('');
  }
  protected cancelEdit(): void { this.editingId.set(null); }
  protected cancelCreate(): void { this.creating.set(false); }

  protected createGrupo(code: string, subjectId: string, promotionId: string, programId: string): void {
    this.saving.set(true);
    this.errorMessage.set('');
    this.api.postGroup({ access_code_group: code.trim(), id_subjects: Number(subjectId), id_promotion: Number(promotionId), id_programs: Number(programId), status_group: 1 }).subscribe({
      next: () => { this.saving.set(false); this.creating.set(false); this.actionMessage.set('Grupo creado correctamente.'); this.loadGroups(); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.details ?? 'No fue posible crear el grupo.'); },
    });
  }

  protected saveGrupo(id: number, code: string, subjectId: string, promotionId: string, programId: string): void {
    this.saving.set(true);
    this.errorMessage.set('');
    this.api.putGroup(id, { access_code_group: code.trim(), id_subjects: Number(subjectId), id_promotion: Number(promotionId), id_programs: Number(programId) }).subscribe({
      next: () => { this.saving.set(false); this.editingId.set(null); this.actionMessage.set('Grupo actualizado correctamente.'); this.loadGroups(); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.error ?? 'No fue posible actualizar el grupo.'); },
    });
  }

  protected deleteSelected(): void { this.confirmingDelete.set(true); }
  protected cancelDelete(): void { this.confirmingDelete.set(false); }

  protected confirmDelete(): void {
    const id = this.selectedId();
    if (id === null) return;
    this.api.deleteGroup(id).subscribe({
      next: () => { this.selectedId.set(null); this.confirmingDelete.set(false); this.actionMessage.set('Grupo eliminado correctamente.'); this.loadGroups(); },
      error: () => this.errorMessage.set('No fue posible eliminar el grupo.'),
    });
  }

  protected selectedGroupCode(): string {
    const id = this.selectedId();
    return id === null ? '' : this.grupos().find((group) => group.id_group === id)?.access_code_group ?? '';
  }
  protected openQrModal(): void { this.showQrModal.set(true); void this.generateQr(); }
  protected openQrForGroup(id: number): void { this.selectGrupo(id); this.openQrModal(); }
  protected closeQrModal(): void { this.showQrModal.set(false); }
  protected async generateQr(): Promise<void> {
    const code = this.selectedGroupCode();
    this.qrDataUrl.set('');
    if (!code) return;
    try {
      const { default: QRCode } = await import('qrcode');
      this.qrDataUrl.set(await QRCode.toDataURL(code, { width: 260, margin: 2, errorCorrectionLevel: 'M' }));
    }
    catch { this.errorMessage.set('No fue posible generar el código QR.'); }
  }
  protected onProgramChange(value: string): void { this.selectedProgramId.set(Number(value) || null); }
  protected promocionesPorPrograma(): PromotionModel[] {
    const id = this.selectedProgramId();
    return id === null ? [] : this.promociones().filter((promotion) => Number(promotion.id_programs) === id && promotion.status_promotions === 1);
  }
}
