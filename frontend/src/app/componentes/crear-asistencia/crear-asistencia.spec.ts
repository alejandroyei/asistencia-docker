import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CrearAsistencia } from './crear-asistencia';

describe('CrearAsistencia', () => {
  let component: CrearAsistencia;
  let fixture: ComponentFixture<CrearAsistencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearAsistencia],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAsistencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
