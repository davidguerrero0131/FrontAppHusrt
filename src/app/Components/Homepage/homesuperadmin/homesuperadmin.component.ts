import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';



@Component({
  selector: 'app-homesuperadmin',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TooltipModule],
  templateUrl: './homesuperadmin.component.html',
  styleUrl: './homesuperadmin.component.css'
})
export class HomesuperadminComponent {

  constructor(
    private router: Router
  ) { }

  viewParametrizacion() {
    this.router.navigate(['/biomedica/parametrizacion']);
  }

  viewGestionBiomedica() {
    this.router.navigate(['/biomedica/gestion-operativa']);
  }

  // Futuros metodos para Sistemas y Mantenimiento
  viewGestionSistemas() {
    // Ejemplo: this.router.navigate(['/sistemas/home']);
  }

  viewGestionMantenimiento() {
    this.router.navigate(['/adminindustriales']);
  }
}
