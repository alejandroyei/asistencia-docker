import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CrearSesion } from './crear-sesion';

describe('CrearSesion', () => {
  let component: CrearSesion;
  let fixture: ComponentFixture<CrearSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSesion],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSesion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
