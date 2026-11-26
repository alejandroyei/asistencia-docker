import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SesionesModel } from '../models/Sesiones';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root',
})
export class SesionesService {
  private http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);

  private apiSesiones = `${this.api}/sesiones`;

  getSessions(){
    return this.http.get<SesionesModel[]>(this.apiSesiones);
  }

  getSessionById(id: number){
    return this.http.get<SesionesModel>(`${this.api}/sesion/id/${id}`);
  }

  getSessionByDate(date: Date){
    return this.http.get<SesionesModel[]>(`${this.apiSesiones}/date/${encodeURIComponent(this.toDateParam(date))}`);
  }

  getSessionsByGroup(id_group: number){
    return this.http.get<SesionesModel[]>(`${this.apiSesiones}/grupoid/${id_group}`);

  }
  
  postSessions(sesion: Omit<SesionesModel, "id">){
    return this.http.post<{ message: string; sessionId: number }>(this.apiSesiones, sesion);
  } 

  putSession(id: number, sesion: Partial<SesionesModel>){
    return this.http.put<SesionesModel>(`${this.apiSesiones}/actualizar/id/${id}`, sesion);
  }

  deleteSession(id: number){
    return this.http.put<{ message: string }>(`${this.apiSesiones}/eliminar/id/${id}`, {})
  }

  private toDateParam(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
