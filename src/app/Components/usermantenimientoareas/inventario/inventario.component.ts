import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { getDecodedAccessToken } from '../../../utilidades';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, ButtonModule, SelectModule, FormsModule, MantenimientoadminnavbarComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  private router = inject(Router);

  // Inventario Data
  equipos: any[] = [];
  selectedEquipo: any;

  backToDashboard() {
    const tokenData = getDecodedAccessToken();
    if (tokenData.rol === 'ADMINMANTENIMIENTO' || tokenData.rol === 'USERMANTENIMIENTO' || tokenData.rol === 'SUPERADMIN') {
      this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    } else {
      this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }
  }

  showViewServicios() { // Mapped to Areas
    this.router.navigate(['/adminmantenimiento/servicios'], { queryParams: { returnUrl: this.router.url } });
  }

  showViewElementosListado() {
    this.router.navigate(['/elementos/listado'], { queryParams: { returnUrl: this.router.url } });
  }
  showViewAsignaciones() {
    this.router.navigate(['/areas/asignar-elementos'], { queryParams: { returnUrl: this.router.url } });
  }
}
