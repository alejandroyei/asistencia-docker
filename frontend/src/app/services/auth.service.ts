import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { LoginResponse } from '../models/Backend';

export type Rol = 'admin' | 'docente' | 'alumno';

export interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  cargo?: string;
  rol?: Rol;
}

export interface Credenciales {
  email: string;
  password: string;
}

interface TokenPayload {
  id: number;
  email: string;
  roleId?: number;
  exp?: number;
}

const TOKEN_STORAGE_KEY = 'asistencia_access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_BASE_URL);
  private readonly _usuario = signal<Usuario | null>(null);
  private readonly _perfil = signal<{ nombre: string; apellido: string; cargo: string } | null>(null);

  readonly usuario = this._usuario.asReadonly();
  readonly perfil = this._perfil.asReadonly();

  constructor() {
    this.setUsuarioFromToken(this.readToken());
  }

  estaAutenticado(): boolean {
    return this._usuario() !== null;
  }

  esAdmin(): boolean {
    return this._usuario()?.rol === 'admin';
  }

  esAlumno(): boolean {
    return this._usuario()?.rol === 'alumno';
  }

  esDocente(): boolean {
    return this._usuario()?.rol === 'docente';
  }

  cargarPerfil(nombre: string, apellido: string, cargo: string): void {
    this._perfil.set({ nombre, apellido, cargo });
    const current = this._usuario();
    if (current) this._usuario.set({ ...current, nombre, apellido, cargo });
  }

  login(credenciales: Credenciales) {
    return this.http.post<LoginResponse>(`${this.api}/login`, credenciales).pipe(
      tap(({ token }) => {
        if (typeof localStorage !== 'undefined') localStorage.setItem(TOKEN_STORAGE_KEY, token);
        this.setUsuarioFromToken(token);
      }),
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(TOKEN_STORAGE_KEY);
    this._usuario.set(null);
    this._perfil.set(null);
  }

  private readToken(): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private setUsuarioFromToken(token: string | null): void {
    if (!token) {
      this._usuario.set(null);
      return;
    }
    try {
      const encodedPayload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      if (!encodedPayload) throw new Error('Token sin payload');
      const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '='))) as TokenPayload;
      if (!payload.id || !payload.email || (payload.exp && payload.exp * 1000 <= Date.now())) {
        this._usuario.set(null);
        return;
      }
      const roles: Record<number, Rol> = { 1: 'admin', 2: 'docente', 3: 'alumno' };
      const role = payload.roleId === undefined ? undefined : roles[payload.roleId];
      this._usuario.set({ id: payload.id, nombre: payload.email, ...(role ? { rol: role, cargo: role === 'admin' ? 'Administrador' : role === 'docente' ? 'Profesor' : 'Estudiante' } : {}) });
    } catch {
      this._usuario.set(null);
    }
  }
}
