import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { IScannerControls } from '@zxing/browser';
import { Menu } from '../menu/menu';
import { GruposService } from '../../services/grupos-service';
import { InscripcionesService } from '../../services/inscripciones-service';
import { AuthService } from '../../services/auth.service';
import { GruposModel } from '../../models/Grupos';
import { RegistrationModel } from '../../models/Backend';

@Component({
  selector: 'app-unirse-grupo',
  imports: [FormsModule, Menu],
  templateUrl: './unirse-grupo.html',
  styleUrl: './unirse-grupo.css',
})
export class UnirseGrupo implements OnInit, OnDestroy {
  private readonly gruposApi = inject(GruposService);
  private readonly inscripcionesApi = inject(InscripcionesService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  @ViewChild('qrVideo') private qrVideo?: ElementRef<HTMLVideoElement>;
  private scannerControls?: IScannerControls;
  protected readonly misGrupos = signal<GruposModel[]>([]);
  protected readonly codigoAcceso = signal('');
  protected readonly loading = signal(false);
  protected readonly actionMessage = signal('');
  protected readonly errorMsg = signal('');
  protected readonly showQrModal = signal(false);
  protected readonly scanning = signal(false);
  private grupos: GruposModel[] = [];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => { const code = params.get('code'); if (code) this.codigoAcceso.set(code); });
    this.gruposApi.getGroups().subscribe({ next: (items) => { this.grupos = items; this.loadMyGroups(); }, error: () => this.errorMsg.set('No fue posible cargar los grupos.') });
  }

  ngOnDestroy(): void { this.stopScanner(); }

  private loadMyGroups(): void {
    const userId = this.auth.usuario()?.id;
    if (!userId) { this.errorMsg.set('Inicia sesión para consultar tus grupos.'); return; }
    this.inscripcionesApi.obtenerPorUsuario(userId).subscribe({
      next: (registrations: RegistrationModel[]) => {
        const ids = new Set(registrations.filter((item) => item.status === 1).map((item) => item.groups));
        this.misGrupos.set(this.grupos.filter((group) => ids.has(group.id_group)));
      },
      error: () => this.errorMsg.set('No fue posible cargar tus inscripciones.'),
    });
  }

  protected unirseGrupo(): void {
    const code = this.codigoAcceso().trim();
    const userId = this.auth.usuario()?.id;
    if (!code) { this.errorMsg.set('Ingresa un código de acceso.'); return; }
    if (!userId) { this.errorMsg.set('Inicia sesión para unirte a un grupo.'); return; }
    const group = this.grupos.find((item) => item.access_code_group.toLowerCase() === code.toLowerCase() && item.status_group === 1);
    if (!group) { this.errorMsg.set('No se encontró un grupo activo con ese código.'); return; }
    this.loading.set(true); this.errorMsg.set(''); this.actionMessage.set('');
    this.inscripcionesApi.crear({ users: userId, groups: group.id_group, status: 1 }).subscribe({
      next: () => { this.loading.set(false); this.codigoAcceso.set(''); this.actionMessage.set('Te uniste al grupo correctamente.'); this.loadMyGroups(); },
      error: (error) => { this.loading.set(false); this.errorMsg.set(error.error?.error ?? 'No fue posible unirte al grupo.'); },
    });
  }

  protected openQrModal(): void { this.errorMsg.set(''); this.showQrModal.set(true); window.setTimeout(() => void this.startScanner(), 0); }
  protected closeQrModal(): void { this.stopScanner(); this.showQrModal.set(false); }
  private async startScanner(): Promise<void> {
    if (!this.qrVideo) return;
    this.scanning.set(true);
    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser');
      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromVideoDevice(undefined, this.qrVideo.nativeElement, (result) => {
        if (!result) return;
        const code = this.extractCode(result.getText());
        if (!code) { this.errorMsg.set('El QR no contiene un código de grupo válido.'); return; }
        this.codigoAcceso.set(code);
        this.actionMessage.set('Código leído. Confirma con “Unirse al grupo”.');
        this.closeQrModal();
      });
      if (this.showQrModal()) this.scannerControls = controls;
      else controls.stop();
    } catch {
      this.scanning.set(false);
      this.errorMsg.set('No fue posible acceder a la cámara. Verifica los permisos del navegador y vuelve a intentarlo.');
    }
  }
  private extractCode(text: string): string {
    try { const url = new URL(text); return url.searchParams.get('code')?.trim() ?? ''; }
    catch { return text.trim(); }
  }
  private stopScanner(): void { this.scannerControls?.stop(); this.scannerControls = undefined; this.scanning.set(false); }
  protected programName(group: GruposModel): string { return group.programs?.name ?? 'Programa'; }
}
