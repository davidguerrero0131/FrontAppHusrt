import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleEquipoIndustrialComponent } from './detalle-equipo-industrial.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('DetalleEquipoIndustrialComponent', () => {
  let component: DetalleEquipoIndustrialComponent;
  let fixture: ComponentFixture<DetalleEquipoIndustrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEquipoIndustrialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEquipoIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});