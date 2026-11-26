import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Menu } from '../menu/menu';
import { PromocionesService } from '../../services/promociones.service';
import { ProgramasService } from '../../services/programas.service';
import { ProgramModel, PromotionModel } from '../../models/Backend';

@Component({
  selector: 'app-promociones',
  imports: [Menu],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css',
})
export class Promociones implements OnInit {
  private readonly api = inject(PromocionesService);
  private readonly programasApi = inject(ProgramasService);
  protected readonly promociones = signal<PromotionModel[]>([]);
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

  protected readonly filteredPromociones = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.promociones().filter((p) => `${p.name_promotion} ${this.programName(p)}`.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadPromotions();
    this.programasApi.obtenerTodos().subscribe({ next: (items) => this.programas.set(items), error: () => this.errorMessage.set('No fue posible cargar los programas.') });
  }

  private loadPromotions(): void {
    this.loading.set(true);
    this.api.obtenerTodas().subscribe({
      next: (items) => { this.promociones.set(items); this.loading.set(false); this.errorMessage.set(''); },
      error: () => { this.loading.set(false); this.errorMessage.set('No fue posible cargar las promociones.'); },
    });
  }

  protected programName(promotion: PromotionModel): string {
    return promotion.Programs?.name ?? this.programas().find((p) => p.id === promotion.id_programs)?.name ?? 'Programa';
  }
  protected onSearch(value: string): void { this.search.set(value); this.selectedId.set(null); }
  protected selectPromocion(id: number): void { this.selectedId.set(id); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected addPromocion(): void { this.creating.set(true); this.editingId.set(null); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected editSelected(): void { this.editingId.set(this.selectedId()); this.actionMessage.set(''); }
  protected cancelEdit(): void { this.editingId.set(null); }
  protected cancelCreate(): void { this.creating.set(false); }

  protected createPromocion(name: string, programId: string): void {
    this.saving.set(true);
    this.api.crear({ name_promotion: name.trim(), id_programs: Number(programId), status_promotions: 1 }).subscribe({
      next: () => { this.saving.set(false); this.creating.set(false); this.actionMessage.set('Promoción creada correctamente.'); this.loadPromotions(); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.details ?? error.error?.error ?? 'No fue posible crear la promoción.'); },
    });
  }

  protected savePromocion(id: number, name: string, programId: string): void {
    this.saving.set(true);
    this.api.actualizar(id, { name_promotion: name.trim(), id_programs: Number(programId) }).subscribe({
      next: () => { this.saving.set(false); this.editingId.set(null); this.actionMessage.set('Promoción actualizada correctamente.'); this.loadPromotions(); },
      error: (error) => { this.saving.set(false); this.errorMessage.set(error.error?.error ?? 'No fue posible actualizar la promoción.'); },
    });
  }

  protected deleteSelected(): void { this.confirmingDelete.set(true); }
  protected cancelDelete(): void { this.confirmingDelete.set(false); }
  protected confirmDelete(): void {
    const id = this.selectedId();
    if (id === null) return;
    this.api.eliminar(id).subscribe({
      next: () => { this.selectedId.set(null); this.confirmingDelete.set(false); this.actionMessage.set('Promoción desactivada correctamente.'); this.loadPromotions(); },
      error: () => this.errorMessage.set('No fue posible desactivar la promoción.'),
    });
  }
}
