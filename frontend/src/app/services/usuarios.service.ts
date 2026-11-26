import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api-config';
import { ApiUser, CreateUserResponse } from '../models/Backend';

export type CrearUsuario = Pick<ApiUser,
  | 'user_first_name'
  | 'user_last_name'
  | 'user_email'
  | 'user_password'
  | 'user_mobile_phone'
  | 'user_role_id'
  | 'user_status_id'
  | 'user_program_id'
> & Partial<Pick<ApiUser,
  | 'user_microsoft_id'
  | 'user_auth_provider'
  | 'user_job_title'
  | 'user_department'
  | 'user_office_location'
  | 'user_business_phones'
  | 'user_permissions'
  | 'user_created_at'
  | 'Programs'
>>;

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);
  private readonly url = `${this.api}/users`;

  crear(usuario: CrearUsuario) {
    return this.http.post<CreateUserResponse>(this.url, usuario);
  }

  actualizar(id: number, user: Partial<CrearUsuario>) {
    return this.http.put<{ message: string }>(`${this.url}/id/${id}`, user);
  }

  obtenerTodos() {
    return this.http.get<ApiUser[]>(this.url);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiUser>(`${this.url}/id/${id}`);
  }

  obtenerPorCorreo(correo: string) {
    return this.http.get<ApiUser>(`${this.url}/email/${encodeURIComponent(correo)}`);
  }

  obtenerPorRol(rol: number) {
    return this.http.get<ApiUser[]>(`${this.url}/rol/${rol}`);
  }

  obtenerPorPrograma(programaId: number) {
    return this.http.get<ApiUser[]>(`${this.url}/program/${programaId}`);
  }

  eliminar(id: number) {
    return this.http.post<{ message: string }>(`${this.api}/deleteUser/id/${id}`, {});
  }
}
