import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { getDecodedAccessToken } from '../../../utilidades';
import { RouterModule } from '@angular/router';
import { ParametrosService } from '../../../Services/appServices/biomedicaServices/parametros/parametros.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import { MesaService } from '../../../Services/mesa-servicios/mesa.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-parametrizacion-biomedica',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, DropdownModule, RouterModule],
    templateUrl: './parametrizacion-biomedica.component.html',
    styleUrl: './parametrizacion-biomedica.component.css'
})
export class ParametrizacionBiomedicaComponent implements OnInit {
    router = inject(Router);
    parametrosService = inject(ParametrosService);
    userService = inject(UserService);

    isSuperAdmin: boolean = false;
    isBiomedicaAdmin: boolean = false;

    

    constructor() {
        this.checkRole();
    }

    ngOnInit() {}

    checkRole() {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded = getDecodedAccessToken();

            if (decoded?.rol === 'SUPERADMIN') {
                this.isSuperAdmin = true;
            }
            if (decoded?.rol === 'BIOMEDICAADMIN') {
                this.isBiomedicaAdmin = true;
            }

        }
    }

    showViewUsuarios() { this.router.navigate(['/admusuarios']); }
    showViewCargos() { this.router.navigate(['/admin/cargos']); }
    showViewServicios() { this.router.navigate(['/admin/servicios']); }
    showViewTiposEquipo() { this.router.navigate(['/admin/tiposequipo']); }
    showViewFabricantes() { this.router.navigate(['/admin/fabricantes']); }
    showViewProveedores() { this.router.navigate(['/admin/proveedores']); }
    showViewResponsables() { this.router.navigate(['/admin/responsables']); }
    showViewTiposDocumento() { this.router.navigate(['/admin/tiposdocumento']); }
    showViewEquipos() { this.router.navigate(['/biomedica/adminequipos']); }
}
