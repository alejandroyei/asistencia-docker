import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegistrationModel } from '../models/Backend';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);
  private readonly url = `${this.api}/registrations`;

  crear(data: Pick<RegistrationModel, 'users' | 'groups' | 'status'>) {
    return this.http.post<{ message: string; id: number }>(this.url, data);
  }
  obtenerTodas() { return this.http.get<RegistrationModel[]>(this.url); }
  obtenerPorId(id: number) { return this.http.get<RegistrationModel>(`${this.url}/id/${id}`); }
  // Estos filtros están publicados, pero sus controladores leen req.params.id.
  obtenerPorUsuario(userId: number) { return this.http.get<RegistrationModel[]>(`${this.url}/user/${userId}`); }
  obtenerPorGrupo(groupId: number) { return this.http.get<RegistrationModel[]>(`${this.url}/group/${groupId}`); }
}
