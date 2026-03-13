import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChequeosIndustrialesService } from '../../../Services/chequeos-industriales.service';

@Component({
    selector: 'app-chequeos-industriales',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chequeos-industriales.component.html',
    styleUrls: ['./chequeos-industriales.component.css']
})
export class ChequeosIndustrialesComponent implements OnInit {

    router = inject(Router);
    chequeosService = inject(ChequeosIndustrialesService);

    faltantesHoy: any[] = [];
    loadingFaltantes = true;
    configuraciones: any[] = []; // dynamic chequeo configs from DB

    async ngOnInit() {
        try {
            this.faltantesHoy = await this.chequeosService.obtenerFaltantesHoy().toPromise() ?? [];
        } catch (e) {
            console.warn('No se pudo cargar la lista de faltantes', e);
            this.faltantesHoy = [];
        } finally {
            this.loadingFaltantes = false;
        }
        // Load dynamic chequeo configs — exclude the 6 that already have hardcoded cards
        const HARDCODED_IDS = new Set(['UPS', 'PLANTAS_ELECTRICAS', 'CALDERAS', 'TRANSFERENCIAS', 'TRANSFORMADORES', 'BOMBAS_AGUA']);
        try {
            const all = await this.chequeosService.obtenerConfigs(false).toPromise() ?? [];
            this.configuraciones = all.filter((c: any) => !HARDCODED_IDS.has(c.identificadorString));
        } catch (e) {
            console.warn('No se pudo cargar las configuraciones de chequeo', e);
        }
    }

    goToChequeoDiario(tipo: string) {
        this.router.navigate(['/industriales/chequeos/diarios'], { queryParams: { equipo: tipo } });
    }

    goToSinChequeo() {
        this.router.navigate(['/industriales/chequeos/sin-chequeo']);
    }

    regresar() {
        this.router.navigate(['/industriales/gestion-operativa']);
    }
}
