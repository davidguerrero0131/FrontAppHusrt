import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
    selector: 'app-parametrizacion-industriales',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    templateUrl: './parametrizacion-industriales.component.html',
    styleUrl: './parametrizacion-industriales.component.css'
})
export class ParametrizacionIndustrialesComponent {
    router = inject(Router);

    constructor() { }

    // Shared Admin Routes
    showViewUsuarios() { this.router.navigate(['/admusuarios']); }
    showViewServicios() { this.router.navigate(['/admin/servicios']); }
    showViewTiposEquipo() { this.router.navigate(['/admin/tiposequipo']); }
    showViewFabricantes() { this.router.navigate(['/admin/fabricantes']); }
    showViewProveedores() { this.router.navigate(['/admin/proveedores']); }
    showViewResponsables() { this.router.navigate(['/admin/responsables']); }
    showViewTiposDocumento() { this.router.navigate(['/admin/tiposdocumento']); }

    // Industrial Specific? We don't have a specific "Gestion de Equipos" equivalent other than Inventory, which is in Gestion Operativa.
    // So we omit the last card from Biomedica.
}
