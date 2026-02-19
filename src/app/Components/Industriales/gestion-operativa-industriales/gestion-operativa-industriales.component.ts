import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
    selector: 'app-gestion-operativa-industriales',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gestion-operativa-industriales.component.html',
    styleUrls: ['./gestion-operativa-industriales.component.css']
})
export class GestionOperativaIndustrialesComponent {

    router = inject(Router);

    constructor() { }

    showViewEquiposIndustriales() {
        this.router.navigate(['/adminequipos']);
    }

    showViewMantenimientosIndustriales() {
        this.router.navigate(['/industriales/gestion-mantenimientos']);
    }

    goToVerProgramacion() {
        this.router.navigate(['/industriales/ver-programacion']);
    }

    showViewAreasFisicas() {
        // Disabled for now
        // Swal.fire('Próximamente', 'Este módulo estará disponible pronto.', 'info');
    }
}
