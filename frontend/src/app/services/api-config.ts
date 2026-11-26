import { InjectionToken } from '@angular/core';

/** Base URL of the Express API, including the /api prefix. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:4000/api',
});
