import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ChequeosIndustrialesService } from '../../../Services/chequeos-industriales.service';
import { getDecodedAccessToken } from '../../../utilidades';

@Component({
    selector: 'app-parametrizacion',
    standalone: true,
    imports: [CommonModule, ButtonModule, TooltipModule, MantenimientoadminnavbarComponent],
    templateUrl: './parametrizacion.component.html',
    styleUrl: './parametrizacion.component.css'
})
export class ParametrizacionComponent implements OnInit {
    private router = inject(Router);
    private chequeosService = inject(ChequeosIndustrialesService);

    tiposEquipoIndustriales: any[] = [];
    userRole: string = 'Administrador';

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

        this.chequeosService.obtenerTiposEquipo().subscribe({
            next: (tipos) => this.tiposEquipoIndustriales = tipos,
            error: (err) => console.error('Error cargando tipos industriales', err)
        });
    }

    backToDashboard() {
        const tokenData = getDecodedAccessToken();
        if (tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'USERMANTENIMIENTO' || tokenData.rol === 'SUPERADMIN') {
            this.router.navigate(['/adminmantenimiento']);
        } else {
            this.router.navigate(['/adminmantenimiento/gestion-operativa']);
        }
    }

    showViewAreas() {
        this.router.navigate(['/areas/listado'], { queryParams: { returnUrl: this.router.url } });
    }

    showViewElementos() {
        this.router.navigate(['/elementos/listado'], { queryParams: { returnUrl: this.router.url } });
    }


    showViewServicios() {
        this.router.navigate(['/adminmantenimiento/servicios'], { queryParams: { returnUrl: this.router.url } });
    }

    showViewTiposIndustriales() {
        this.router.navigate(['/admin/tiposequipo'], { queryParams: { modulo: 'industrial' } });
    }
}
