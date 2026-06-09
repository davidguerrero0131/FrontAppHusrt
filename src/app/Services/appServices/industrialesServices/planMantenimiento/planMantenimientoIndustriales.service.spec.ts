import { TestBed } from '@angular/core/testing';
import { PlanMantenimientoIndustrialesService } from './planMantenimientoIndustriales.service';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';


describe('PlanMantenimientoIndustrialesService', () => {
  let service: PlanMantenimientoIndustrialesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanMantenimientoIndustrialesService);
  });

  it('should be created', () => {
    assert.ok(service);
  });
});