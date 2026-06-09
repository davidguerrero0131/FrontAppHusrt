import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getDecodedAccessToken } from '../../../utilidades';
import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-gestion-operativa-industriales',
    standalone: true,
    imports: [CommonModule, MantenimientoadminnavbarComponent, ButtonModule, TooltipModule],
    templateUrl: './gestion-operativa-industriales.component.html',
    styleUrls: ['./gestion-operativa-industriales.component.css']
})
export class GestionOperativaIndustrialesComponent implements OnInit {

    router = inject(Router);
    userRole: string = 'Administrador';

    constructor() { }

    ngOnInit(): void {
        const tokenData = getDecodedAccessToken();
        if (tokenData) {
            this.userRole = 'Administrador';
            if (tokenData.rol === 'TECNICOMANTENIMIENTO') {
                this.userRole = 'Técnico';
            } else if (tokenData.rol === 'USERMANTENIMIENTO') {
                this.userRole = 'Usuario';
            }
        }
    }

    backToDashboard() {
    window.history.back();
  }

    showViewEquiposIndustriales() {
        this.router.navigate(['/industriales/equipos']);
    }

    showViewMantenimientosIndustriales() {
        this.router.navigate(['/industriales/gestion-mantenimientos']);
    }

    goToVerProgramacion() {
        this.router.navigate(['/industriales/ver-programacion']);
    }

    goToIndicadores() {
        this.router.navigate(['/industriales/indicadores']);
    }

    goToChequeos() {
        this.router.navigate(['/industriales/chequeos']);
    }

    showViewAreasFisicas() {
        // Disabled for now
        // Swal.fire('Próximamente', 'Este módulo estará disponible pronto.', 'info');
    }
}
