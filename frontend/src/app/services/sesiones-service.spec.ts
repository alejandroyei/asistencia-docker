import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SesionesService } from './sesiones-service';

describe('SesionesService', () => {
  let service: SesionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(SesionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
