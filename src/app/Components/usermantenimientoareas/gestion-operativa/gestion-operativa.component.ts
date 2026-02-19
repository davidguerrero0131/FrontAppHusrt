import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';

@Component({
  selector: 'app-gestion-operativa',
  standalone: true,
  imports: [CommonModule, ButtonModule, MantenimientoadminnavbarComponent],
  templateUrl: './gestion-operativa.component.html',
  styleUrl: './gestion-operativa.component.css'
})
export class GestionOperativaComponent {
  private router = inject(Router);

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento']);
  }

  showViewInventario() {
    this.router.navigate(['/adminmantenimiento/inventario']);
  }

  showViewMantenimiento() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa/mantenimiento']);
  }

  showViewInspecciones() {
    this.router.navigate(['/areas/inspecciones/listado']);
  }

  showViewReportes() {
    this.router.navigate(['/adminmantenimiento/reportes-general']);
  }

  showViewSemaforizacion() { }
  showViewIndicadores() { }
  showViewCalendario() { }
  showViewActividadesMetrologicas() { }
}
