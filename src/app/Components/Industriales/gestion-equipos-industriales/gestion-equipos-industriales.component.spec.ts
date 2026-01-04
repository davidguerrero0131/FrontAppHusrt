import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEquiposIndustrialesComponent } from './gestion-equipos-industriales.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('GestionEquiposIndustrialesComponent', () => {
  let component: GestionEquiposIndustrialesComponent;
  let fixture: ComponentFixture<GestionEquiposIndustrialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEquiposIndustrialesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEquiposIndustrialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});