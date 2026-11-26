import { InjectionToken } from '@angular/core';

/** Uses the local API in ng serve and the same-origin Nginx proxy in containers. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => {
    if (typeof window === 'undefined') return 'http://localhost:4000/api';
    const { hostname, origin, port, protocol } = window.location;
    return port === '4200' || port === '4201'
      ? `${protocol}//${hostname}:4000/api`
      : `${origin}/api`;
  },
});
