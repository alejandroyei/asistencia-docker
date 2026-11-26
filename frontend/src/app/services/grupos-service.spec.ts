import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { GruposService } from './grupos-service';

describe('GruposService', () => {
  let service: GruposService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(GruposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
