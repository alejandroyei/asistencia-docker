import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../menu/menu';
import { SesionesService } from '../../services/sesiones-service';
import { GruposService } from '../../services/grupos-service';
import { SesionesModel } from '../../models/Sesiones';
import { GruposModel } from '../../models/Grupos';

@Component({selector:'app-sesiones',imports:[RouterLink,Menu],templateUrl:'./sesiones.html',styleUrl:'./sesiones.css'})
export class Sesiones implements OnInit {
 private readonly api=inject(SesionesService); private readonly gruposApi=inject(GruposService);
 protected sesiones=signal<SesionesModel[]>([]); protected grupos=signal<GruposModel[]>([]); protected editing=signal<SesionesModel|null>(null); protected error=signal(''); protected message=signal(''); protected saving=signal(false);
 ngOnInit():void { this.reload(); this.gruposApi.getGroups().subscribe({next:g=>this.grupos.set(g),error:()=>this.error.set('No fue posible cargar los grupos.')}); }
 private reload():void {this.api.getSessions().subscribe({next:s=>this.sesiones.set(s.filter(x=>x.status===1)),error:()=>this.error.set('No fue posible cargar las sesiones.')});}
 protected getGrupo(id:number):GruposModel|undefined{return this.grupos().find(g=>g.id_group===id);}
 protected iniciarEdicion(s:SesionesModel):void {this.editing.set({...s});this.message.set('');}
 protected setDate(value:string):void {this.editing.update(s=>s?{...s,date:value}:s);}
 protected setGroup(value:string):void {this.editing.update(s=>s?{...s,id_group:Number(value)}:s);}
 protected guardarEdicion():void {const s=this.editing();if(!s)return;this.saving.set(true);this.api.putSession(s.id,{date:s.date,day:new Date(`${s.date}T00:00:00`).getDay(),id_group:s.id_group}).subscribe({next:()=>{this.saving.set(false);this.editing.set(null);this.message.set('Sesión actualizada.');this.reload();},error:e=>{this.saving.set(false);this.error.set(e.error?.error??'No se pudo actualizar la sesión.');}});}
 protected cancelarEdicion():void{this.editing.set(null);}
 protected eliminar(id:number):void{if(!confirm('¿Deseas desactivar esta sesión?'))return;this.api.deleteSession(id).subscribe({next:()=>{this.message.set('Sesión desactivada.');this.reload();},error:()=>this.error.set('No fue posible eliminar la sesión.')});}
}
