import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionPlanMantenimientoComponent } from './gestion-plan-mantenimiento.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('GestionPlanMantenimientoComponent', () => {
  let component: GestionPlanMantenimientoComponent;
  let fixture: ComponentFixture<GestionPlanMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlanMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlanMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});