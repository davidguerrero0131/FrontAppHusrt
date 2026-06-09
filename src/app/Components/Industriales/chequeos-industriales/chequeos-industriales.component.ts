import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ChequeosIndustrialesService } from '../../../Services/chequeos-industriales.service';
import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
    selector: 'app-chequeos-industriales',
    standalone: true,
    imports: [CommonModule, IndustrialesNavbarComponent],
    templateUrl: './chequeos-industriales.component.html',
    styleUrls: ['./chequeos-industriales.component.css']
})
export class ChequeosIndustrialesComponent implements OnInit {

    router = inject(Router);
    chequeosService = inject(ChequeosIndustrialesService);

    faltantesHoy: any[] = [];
    loadingFaltantes = true;
    configuraciones: any[] = []; // dynamic chequeo configs from DB
    userRole: string = '';

    private getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    loadUserRole() {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            try {
                const decoded: any = this.getDecodedAccessToken(token);
                this.userRole = decoded ? decoded.rol : '';
            } catch (e) {
                console.error('Error decoding token', e);
            }
        }
    }

    canViewSinChequeo(): boolean {
        // TECNICOMANTENIMIENTO is restricted
        return this.userRole !== 'TECNICOMANTENIMIENTO';
    }

    async ngOnInit() {
        this.loadUserRole();
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

    goToChequeoDiario(tipo: string, tipoId?: number) {
        const queryParams: any = { equipo: tipo };
        if (tipoId) queryParams.tipoId = tipoId;
        this.router.navigate(['/industriales/chequeos/diarios'], { queryParams });
    }

    goToSinChequeo() {
        this.router.navigate(['/industriales/chequeos/sin-chequeo']);
    }

    regresar() {
    window.history.back();
  }
}
