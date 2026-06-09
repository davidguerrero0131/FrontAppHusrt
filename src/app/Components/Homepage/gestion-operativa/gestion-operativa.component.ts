import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-gestion-operativa',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, RouterModule],
    templateUrl: './gestion-operativa.component.html',
    styleUrl: './gestion-operativa.component.css'
})
export class GestionOperativaComponent {
    router = inject(Router);

    constructor() { }

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    getRole(): string | null {
        if (typeof localStorage === 'undefined') return null;
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded = this.getDecodedAccessToken(token);
            return decoded ? decoded.rol : null;
        }
        return null;
    }

    showViewInventarioBio() { this.router.navigate(['/biomedica/inventario']); }

    showViewMantenimientoBio() {
        const rol = this.getRole();
        if (rol === 'BIOMEDICATECNICO') {
            this.router.navigate(['/biomedica/tecnico/mantenimiento']);
        } else {
            this.router.navigate(['/biomedica/mantenimiento']);
        }
    }

    showViewSemaforizacionBio() { this.router.navigate(['/biomedica/semaforizacion']); }
    showViewIndicadoresBio() { this.router.navigate(['/biomedica/indicadores']); }
    showViewCalendarioBio() { this.router.navigate(['/biomedica/calendario']); }
    showViewActividadesMetrologicasBio() { this.router.navigate(['/biomedica/actividadesmetrologicas']); }
    showViewEquiposBajaBio() { this.router.navigate(['/biomedica/equiposbaja']); }
}
