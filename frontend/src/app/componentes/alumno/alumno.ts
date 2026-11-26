import { Component, inject, OnInit, signal } from '@angular/core';
import { Menu } from '../menu/menu';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { GruposService } from '../../services/grupos-service';
import { InscripcionesService } from '../../services/inscripciones-service';
import { ApiUser, RegistrationModel } from '../../models/Backend';
import { GruposModel } from '../../models/Grupos';
import { forkJoin } from 'rxjs';

@Component({ selector: 'app-alumno', imports: [Menu], templateUrl: './alumno.html', styleUrl: './alumno.css' })
export class Alumno implements OnInit {
  private readonly auth=inject(AuthService); private readonly users=inject(UsuariosService); private readonly groupsApi=inject(GruposService); private readonly regsApi=inject(InscripcionesService);
  protected readonly alumno=signal<ApiUser|null>(null); protected readonly grupos=signal<GruposModel[]>([]); protected readonly loading=signal(true); protected readonly error=signal('');
  ngOnInit():void { const id=this.auth.usuario()?.id; if(!id){this.loading.set(false);this.error.set('Inicia sesión para ver tu perfil.');return;} forkJoin({user:this.users.obtenerPorId(id),registrations:this.regsApi.obtenerPorUsuario(id),groups:this.groupsApi.getGroups()}).subscribe({next:({user,registrations,groups})=>{this.alumno.set(user);const ids=new Set(registrations.filter((r:RegistrationModel)=>r.status===1).map(r=>r.groups));this.grupos.set(groups.filter(g=>ids.has(g.id_group)));this.auth.cargarPerfil(user.user_first_name,user.user_last_name,'Estudiante');this.loading.set(false);},error:()=>{this.error.set('No fue posible cargar los datos del perfil.');this.loading.set(false);}});}
  protected program():string { return this.alumno()?.Programs?.name ?? 'Sin programa registrado'; }
}
