import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Rol } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = route.data['roles'] as Rol[] | undefined;
  if (!auth.estaAutenticado()) return router.createUrlTree(['/auth']);
  if (allowed?.includes(auth.usuario()?.rol as Rol)) return true;
  return router.createUrlTree([auth.esAlumno() ? '/asistencia' : auth.esDocente() ? '/grupos' : '/usuarios']);
};

export const authenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.estaAutenticado() ? true : inject(Router).createUrlTree(['/auth']);
};
