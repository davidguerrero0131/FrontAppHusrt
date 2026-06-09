import { TestBed } from '@angular/core/testing';

import { EquiposIndustrialesService } from './equiposIndustriales.service';
import { beforeEach, describe, it } from 'node:test';

import assert from 'node:assert';

describe('EquiposService', () => {
  let service: EquiposIndustrialesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquiposIndustrialesService);
  });

  it('should be created', () => {
    assert.ok(service);
  });
});