import { TestBed } from '@angular/core/testing';

import { EspaciosReservaService } from './espacios-reserva.service';

describe('EspaciosReservaService', () => {
  let service: EspaciosReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaciosReservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
