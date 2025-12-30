import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-parametrizacion-biomedica',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    templateUrl: './parametrizacion-biomedica.component.html',
    styleUrl: './parametrizacion-biomedica.component.css'
})
export class ParametrizacionBiomedicaComponent {
    router = inject(Router);

    constructor() { }

    showViewUsuarios() { this.router.navigate(['/admusuarios']); }
    showViewServicios() { this.router.navigate(['/admin/servicios']); }
    showViewTiposEquipo() { this.router.navigate(['/admin/tiposequipo']); }
    showViewFabricantes() { this.router.navigate(['/admin/fabricantes']); }
    showViewProveedores() { this.router.navigate(['/admin/proveedores']); }
    showViewResponsables() { this.router.navigate(['/admin/responsables']); }
    showViewTiposDocumento() { this.router.navigate(['/admin/tiposdocumento']); }
}
