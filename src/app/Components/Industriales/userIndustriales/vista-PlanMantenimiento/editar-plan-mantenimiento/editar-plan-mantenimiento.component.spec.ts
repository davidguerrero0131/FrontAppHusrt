import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPlanMantenimientoComponent } from './editar-plan-mantenimiento.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('EditarPlanMantenimientoComponent', () => {
  let component: EditarPlanMantenimientoComponent;
  let fixture: ComponentFixture<EditarPlanMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPlanMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPlanMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});