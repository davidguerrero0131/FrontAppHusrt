import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearEquipoIndustrialComponent } from './crear-equipo-industrial.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('CrearEquipoIndustrialComponent', () => {
  let component: CrearEquipoIndustrialComponent;
  let fixture: ComponentFixture<CrearEquipoIndustrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEquipoIndustrialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEquipoIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});