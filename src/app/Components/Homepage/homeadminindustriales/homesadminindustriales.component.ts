import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';
// import { PlanMantenimientoIndustrialesService } from '../../../Services/appServices/industrialesServices/planMantenimiento/planMantenimientoIndustriales.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-homesadminindustriales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IndustrialesNavbarComponent
  ],
  templateUrl: './homesadminindustriales.component.html',
  styleUrl: './homesadminindustriales.component.css'
})
export class homeadminindustrialescomponent {

  private router = inject(Router);


  constructor() { }

  // Navegación
  newEquipoIndustrial() {
    this.router.navigate(['/Industriales/nuevoequipoindustrial']);
  }

  showViewEquiposIndustriales() {
    this.router.navigate(['/adminequipos']);
  }

  newMantenimientoIndustrial() {
    this.router.navigate(['/industriales/crear-plan-mantenimiento']);
  }

  showViewMantenimientosIndustriales() {
    this.router.navigate(['/industriales/gestion-plan-mantenimiento']);
  }

  // Navegación Programación
  goToProgramarMantenimiento() {
    this.router.navigate(['/industriales/programar-mantenimiento']);
  }

  goToVerProgramacion() {
    this.router.navigate(['/industriales/ver-programacion']);
  }
}
