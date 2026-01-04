import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IndustrialesNavbarComponent  } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
  selector: 'app-homesadminindustriales',
  standalone: true,
  imports: [IndustrialesNavbarComponent ],
  templateUrl: './homesadminindustriales.component.html',
  styleUrl: './homesadminindustriales.component.css'
})
export class homeadminindustrialescomponent {

  constructor(
    private router: Router
  ){}

  newEquipoIndustrial(){
    this.router.navigate(['/Industriales/nuevoequipoindustrial']);
  }

  showViewEquiposIndustriales(){
    this.router.navigate(['/adminequipos']);
  }

  newMantenimientoIndustrial(){
    this.router.navigate(['/industriales/crear-plan-mantenimiento']);
  }

  showViewMantenimientosIndustriales(){
    this.router.navigate(['/industriales/gestion-plan-mantenimiento']);
  }
}
