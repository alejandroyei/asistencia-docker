import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../menu/menu';
import { GruposService } from '../../services/grupos-service';
import { GruposModel } from '../../models/Grupos';

@Component({
  selector: 'app-explorar-grupos',
  imports: [RouterLink, Menu],
  templateUrl: './explorar-grupos.html',
  styleUrl: './explorar-grupos.css',
})
export class ExplorarGrupos implements OnInit {
  private readonly api = inject(GruposService);
  protected readonly grupos = signal<GruposModel[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly search = signal('');
  protected readonly filteredGroups = computed(() => { const q=this.search().trim().toLowerCase(); return this.grupos().filter(g=>`${g.access_code_group} ${g.subjects?.name_subjects??''} ${g.programs?.name??''} ${g.promotion?.name_promotion??''}`.toLowerCase().includes(q)); });

  ngOnInit(): void {
    this.api.getGroups().subscribe({
      next: (items) => { this.grupos.set(items.filter((group) => group.status_group === 1)); this.loading.set(false); },
      error: () => { this.errorMessage.set('No fue posible cargar los grupos disponibles.'); this.loading.set(false); },
    });
  }
  protected onSearch(value:string): void { this.search.set(value); }
}
