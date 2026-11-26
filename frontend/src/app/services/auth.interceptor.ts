import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_STORAGE_KEY = 'asistencia_access_token';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (typeof localStorage === 'undefined') return next(request);

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) return next(request);

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  }));
};
