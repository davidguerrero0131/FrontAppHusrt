import { TestBed } from '@angular/core/testing';

import { ResponsableService } from './responsable.service';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('ResponsableService', () => {
  let service: ResponsableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsableService);
  });

  it('should be created', () => {
    assert.ok(service);
  });
});
