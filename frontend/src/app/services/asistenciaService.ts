import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AsistenciaModel } from '../models/Asistencia';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {

  private http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);

  private apiAsistencia = `${this.api}/asistencias`;

  getAttendance(){
    return this.http.get<AsistenciaModel[]>(this.apiAsistencia);
  }

  getAttendanceById(id: number){
    return this.http.get<AsistenciaModel>(`${this.apiAsistencia}/id/${id}`);
  }

  getAttendanceByDate(date: Date | string){
    const value = date instanceof Date ? this.toDateParam(date) : date;
    return this.http.get<AsistenciaModel[]>(`${this.apiAsistencia}/date/${encodeURIComponent(value)}`);
  }

  getAttendanceByUser(id: number){
    return this.http.get<AsistenciaModel[]>(`${this.apiAsistencia}/userid/${id}`);
  }

  getAttendanceBySession(id: number){
    return this.http.get<AsistenciaModel[]>(`${this.apiAsistencia}/sessionid/${id}`);

  }
  
  postAttendance(asistencia: Omit<AsistenciaModel, "id">){
    return this.http.post<{ message: string; attendanceId: number }>(this.apiAsistencia, asistencia);
  } 

  putAttendance(id: number, asistencia: Partial<AsistenciaModel>){
    return this.http.put<AsistenciaModel>(`${this.apiAsistencia}/actualizar/id/${id}`, asistencia)
  }

  deleteAttendance(id: number){
    return this.http.put<{ message: string }>(`${this.apiAsistencia}/eliminar/id/${id}`, {})
  }

  private toDateParam(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
}
