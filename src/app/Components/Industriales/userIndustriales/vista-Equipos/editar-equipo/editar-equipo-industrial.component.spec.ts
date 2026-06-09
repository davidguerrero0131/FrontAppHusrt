import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarEquipoIndustrialComponent } from './editar-equipo-industrial.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('EditarEquipoIndustrialComponent', () => {
  let component: EditarEquipoIndustrialComponent;
  let fixture: ComponentFixture<EditarEquipoIndustrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEquipoIndustrialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEquipoIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});