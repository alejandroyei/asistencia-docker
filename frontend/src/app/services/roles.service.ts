import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RoleModel } from '../models/Backend';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/roles`;

  obtenerTodos() { return this.http.get<RoleModel[]>(this.url); }
  obtenerPorId(id: number) { return this.http.get<RoleModel>(`${this.url}/id/${id}`); }
  obtenerPorNombre(nombre: string) { return this.http.get<RoleModel>(`${this.url}/name/${encodeURIComponent(nombre)}`); }
}
