import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AsistenciaService } from '../../services/asistenciaService';
import { AsistenciaModel } from '../../models/Asistencia';
import { Menu } from '../menu/menu';
import { AuthService } from '../../services/auth.service';
import { GruposService } from '../../services/grupos-service';
import { SesionesService } from '../../services/sesiones-service';
import { GruposModel } from '../../models/Grupos';
import { SesionesModel } from '../../models/Sesiones';

@Component({selector:'app-asistencia',imports:[Menu,DatePipe],templateUrl:'./asistencia.html',styleUrl:'./asistencia.css'})
export class Asistencia implements OnInit {
 private readonly api=inject(AsistenciaService); protected readonly auth=inject(AuthService); private readonly groupApi=inject(GruposService); private readonly sessionApi=inject(SesionesService);
 protected asistencia:AsistenciaModel[]=[]; protected groups=signal<GruposModel[]>([]); protected sessions=signal<SesionesModel[]>([]); protected selectedGroup=signal<number|null>(null); protected loading=signal(false);
 ngOnInit():void {if(this.auth.esAlumno()){this.loading.set(true);this.api.getAttendanceByUser(this.auth.usuario()!.id).subscribe({next:d=>{this.asistencia=d;this.loading.set(false);this.loadContext();},error:()=>this.loading.set(false)});}else{this.groupApi.getGroups().subscribe({next:g=>this.groups.set(g.filter(x=>x.status_group===1))});}}
 private loadContext():void {forkJoin({sessions:this.sessionApi.getSessions(),groups:this.groupApi.getGroups()}).subscribe({next:({sessions,groups})=>{this.sessions.set(sessions);this.groups.set(groups);}});}
 protected selectGroup(id:number):void {this.selectedGroup.set(id);this.loading.set(true);this.sessionApi.getSessionsByGroup(id).subscribe({next:s=>{this.sessions.set(s);if(!s.length){this.asistencia=[];this.loading.set(false);return;}forkJoin(s.map(x=>this.api.getAttendanceBySession(x.id))).subscribe({next:all=>{this.asistencia=all.flat();this.loading.set(false);},error:()=>this.loading.set(false)});},error:()=>this.loading.set(false)});}
 protected backToGroups():void{this.selectedGroup.set(null);this.asistencia=[];}
 protected groupForSession(id:number):GruposModel|undefined{const session=this.sessions().find(s=>s.id===id);return this.groups().find(g=>g.id_group===session?.id_group);}
 protected getGroupName(g:GruposModel):string{return `${g.access_code_group} · ${g.subjects?.name_subjects??''}`;}
}
