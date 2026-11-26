import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Asistencia } from './asistencia';

describe('Asistencia', () => {
  let component: Asistencia;
  let fixture: ComponentFixture<Asistencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Asistencia],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Asistencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
