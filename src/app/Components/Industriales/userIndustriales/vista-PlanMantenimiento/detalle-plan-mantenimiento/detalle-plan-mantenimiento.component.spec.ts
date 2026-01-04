import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePlanMantenimientoComponent } from './detalle-plan-mantenimiento.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('DetallePlanMantenimientoComponent', () => {
  let component: DetallePlanMantenimientoComponent;
  let fixture: ComponentFixture<DetallePlanMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePlanMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePlanMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});