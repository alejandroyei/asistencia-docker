import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('asistencia_access_token');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    auth.logout();
  });

  it('saves the API token and attaches it to later requests', () => {
    const token = 'header.eyJpZCI6MSwiZW1haWwiOiJhQGIuY29tIn0.signature';
    auth.login({ email: 'a@b.com', password: 'secret' }).subscribe();

    const loginRequest = httpMock.expectOne((request) => request.url.endsWith('/api/login'));
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual({ email: 'a@b.com', password: 'secret' });
    loginRequest.flush({ message: 'ok', token });

    expect(localStorage.getItem('asistencia_access_token')).toBe(token);
    expect(auth.usuario()?.id).toBe(1);

    http.get('/api/users').subscribe();
    const protectedRequest = httpMock.expectOne((request) => request.url.endsWith('/api/users'));
    expect(protectedRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    protectedRequest.flush([]);
  });
});
