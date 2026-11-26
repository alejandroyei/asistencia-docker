import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { InscripcionesService } from './inscripciones-service';

describe('InscripcionesService', () => {
  let service: InscripcionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(InscripcionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
