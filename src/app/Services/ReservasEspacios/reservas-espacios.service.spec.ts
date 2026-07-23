import { TestBed } from '@angular/core/testing';

import { ReservasEspaciosService } from './reservas-espacios.service';

describe('ReservasEspaciosService', () => {
  let service: ReservasEspaciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasEspaciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
