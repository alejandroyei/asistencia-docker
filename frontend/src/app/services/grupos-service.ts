import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GruposModel } from '../models/Grupos';
import { API_BASE_URL } from './api-config';
import { ApiUser, RegistrationModel } from '../models/Backend';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GruposService {
  private http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);
  private apiGrupos = `${this.api}/grupos`;

  getGroups(){
    return this.http.get<GruposModel[]>(this.apiGrupos);
  }

  getGroupById(id_group: number){
    return this.http.get<GruposModel>(`${this.apiGrupos}/id/${id_group}`);
  }

  getGroupBySubject(id_subjects: number){
    return this.http.get<GruposModel[]>(`${this.apiGrupos}/materias/id/${id_subjects}`);
  }

  getGroupByProgram(id_programs: number){
    return this.http.get<GruposModel[]>(`${this.apiGrupos}/programas/id/${id_programs}`);

  }

  getGroupByPromotion(id_promotion: number){
    return this.http.get<GruposModel[]>(`${this.apiGrupos}/promociones/id/${id_promotion}`);

  }

  getUsersByGroup(id: number){
    return forkJoin({
      registrations: this.http.get<RegistrationModel[]>(`${this.api}/registrations/group/${id}`),
      users: this.http.get<ApiUser[]>(`${this.api}/users`),
    }).pipe(map(({ registrations, users }) => {
      const userIds = new Set(
        registrations.filter((registration) => registration.status === 1)
          .map((registration) => registration.users),
      );
      return users.filter((user) => userIds.has(user.user_id));
    }));

  }
  
  postGroup(group: Pick<GruposModel, 'access_code_group' | 'id_subjects' | 'id_promotion' | 'id_programs' | 'status_group'>){
    return this.http.post<{ message: string; groupId: number }>(this.apiGrupos, group);
  } 

  putGroup(id_group: number, group: Partial<GruposModel>){
    return this.http.put<{ message: string }>(`${this.apiGrupos}/actualizar/id/${id_group}`, group);
  }

  deleteGroup(id_group: number){
    return this.http.delete<{ message: string }>(`${this.apiGrupos}/eliminar/id/${id_group}`)
  }
}
