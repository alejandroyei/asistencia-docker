import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  template: `@if (mostrarPerfil) { <section class="account" aria-label="Usuario conectado"><span class="account-avatar">{{ initials }}</span><span><strong>{{ fullName }}</strong><small>{{ cargo }}</small></span></section> }`,
  styles: [`:host{position:fixed;right:1.5rem;top:1rem;z-index:1000}.account{align-items:center;display:flex;gap:.7rem;background:#ffffffed;border:1px solid #e1e7f0;border-radius:2rem;padding:.35rem .85rem .35rem .35rem;box-shadow:0 2px 8px #18345b12}.account-avatar{align-items:center;background:#153f87;border-radius:50%;color:#fff;display:inline-flex;font-size:.76rem;font-weight:700;height:38px;justify-content:center;width:38px}.account strong,.account small{display:block}.account strong{color:#34435d;font-size:.84rem}.account small{color:#8390a3;font-size:.74rem}`],
})
export class PerfilUsuario {
  protected readonly auth = inject(AuthService);
  private readonly users = inject(UsuariosService);
  protected readonly router = inject(Router);
  constructor(){effect(()=>{const user=this.auth.usuario();if(user&&!this.auth.perfil())this.users.obtenerPorId(user.id).subscribe({next:data=>this.auth.cargarPerfil(data.user_first_name,data.user_last_name,this.roleName(data.user_role_id))});});}
  get mostrarPerfil(): boolean { const path = this.router.url.split(/[?#]/, 1)[0]; return !!this.auth.usuario() && !['', '/', '/auth', '/registrarse'].includes(path); }
  get fullName(): string { const p=this.auth.perfil(); return p ? `${p.nombre} ${p.apellido}` : this.auth.usuario()?.nombre ?? 'Usuario'; }
  get cargo(): string { return this.auth.perfil()?.cargo ?? this.auth.usuario()?.cargo ?? 'Usuario'; }
  get initials(): string { return this.fullName.split(/\s+/).map((n)=>n[0]).join('').slice(0,2).toUpperCase(); }
  private roleName(id:number): string { return ({1:'Administrador',2:'Profesor',3:'Estudiante'} as Record<number,string>)[id] ?? 'Usuario'; }
}
