import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PromotionModel } from '../models/Backend';
import { API_BASE_URL } from './api-config';

export type CrearPromocion = Pick<PromotionModel, 'name_promotion' | 'id_programs' | 'status_promotions'>;

@Injectable({ providedIn: 'root' })
export class PromocionesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/promociones`;

  obtenerTodas() { return this.http.get<PromotionModel[]>(this.url); }
  obtenerPorId(id: number) { return this.http.get<PromotionModel>(`${this.url}/id/${id}`); }
  obtenerPorPrograma(programaId: number) { return this.http.get<PromotionModel[]>(`${this.url}/programaid/${programaId}`); }
  crear(promocion: CrearPromocion) { return this.http.post<{ promotionId: number }>(this.url, promocion); }
  actualizar(id: number, promocion: Partial<CrearPromocion>) {
    return this.http.put<{ message: string }>(`${this.url}/actualizar/id/${id}`, promocion);
  }
  eliminar(id: number) { return this.http.delete<{ message: string }>(`${this.url}/eliminar/id/${id}`); }
}
