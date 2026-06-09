import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPlanMantenimientoComponent } from './crear-plan-mantenimiento.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('CrearPlanMantenimientoComponent', () => {
  let component: CrearPlanMantenimientoComponent;
  let fixture: ComponentFixture<CrearPlanMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPlanMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPlanMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});