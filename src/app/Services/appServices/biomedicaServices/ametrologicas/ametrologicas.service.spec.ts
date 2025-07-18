import { TestBed } from '@angular/core/testing';

import { AmetrologicasService } from './ametrologicas.service';

describe('AmetrologicasService', () => {
  let service: AmetrologicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmetrologicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
