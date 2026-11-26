import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProgramSubjectModel } from '../models/Backend';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class ProgramasMateriasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/programasmaterias`;

  obtenerTodas() { return this.http.get<ProgramSubjectModel[]>(this.url); }
  obtenerPorId(id: number) { return this.http.get<ProgramSubjectModel>(`${this.url}/id/${id}`); }

  obtenerPorMateria(subjectId: number) { return this.http.get<ProgramSubjectModel[]>(`${this.url}/subjects/${subjectId}`); }
  obtenerPorPrograma(programId: number) { return this.http.get<ProgramSubjectModel[]>(`${this.url}/programs/${programId}`); }
}
