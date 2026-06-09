import { TestBed } from '@angular/core/testing';
import { HojaDeVidaIndustrialService } from './HojaDeVidaIndustrial.service';
import { beforeEach, describe, it } from 'node:test'; // Patrón copiado de equiposIndustriales.service.spec.ts
import assert from 'node:assert';

describe('HojaDeVidaIndustrialService', () => {
    let service: HojaDeVidaIndustrialService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HojaDeVidaIndustrialService);
    });

    it('should be created', () => {
        assert.ok(service);
    });
});
