import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-homeadminmesaservicios',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TooltipModule],
  templateUrl: './homeadminmesaservicios.component.html',
  styleUrl: './homeadminmesaservicios.component.css'
})
export class HomeadminmesaserviciosComponent {

  constructor(private router: Router) { }

  viewCategorias() {
    this.router.navigate(['/adminmesaservicios/config/categorias']);
  }

  viewRoles() {
    this.router.navigate(['/adminmesaservicios/config/roles']);
  }

  viewCasos() {
    this.router.navigate(['/adminmesaservicios/casos']);
  }

  viewIndicadores() {
    // Placeholder for Phase 6
    // this.router.navigate(['/adminmesaservicios/indicadores']);
  }
}
