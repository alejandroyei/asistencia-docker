import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SubjectModel } from '../models/Backend';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/materias`;

  obtenerTodas() { return this.http.get<SubjectModel[]>(this.url); }
  obtenerPorId(id: number) { return this.http.get<SubjectModel>(`${this.url}/id/${id}`); }
  obtenerPorNombre(nombre: string) { return this.http.get<SubjectModel>(`${this.url}/name/${encodeURIComponent(nombre)}`); }
  crear(materia: Pick<SubjectModel, 'name' | 'status'>) {
    return this.http.post<{ subjectsId: number }>(this.url, materia);
  }
  actualizar(id: number, materia: Partial<Pick<SubjectModel, 'name' | 'status'>>) {
    return this.http.put<{ message: string }>(`${this.url}/actualizar/id/${id}`, materia);
  }
  eliminar(id: number) { return this.http.put<{ message: string }>(`${this.url.replace('/materias', '/materia')}/eliminar/id/${id}`, {}); }
}
