import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProgramModel } from '../models/Backend';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class ProgramasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/programs`;

  obtenerTodos() { return this.http.get<ProgramModel[]>(this.url); }
  obtenerPorId(id: number) { return this.http.get<ProgramModel>(`${this.url}/id/${id}`); }
  obtenerPorNombre(nombre: string) { return this.http.get<ProgramModel[]>(`${this.url}/name/${encodeURIComponent(nombre)}`); }
  crear(programa: Pick<ProgramModel, 'name'>) { return this.http.post<{ programsId: number }>(this.url, programa); }
  actualizar(id: number, programa: Partial<Pick<ProgramModel, 'name'>>) {
    return this.http.put<{ message: string }>(`${this.url}/actualizar/id/${id}`, programa);
  }
}
