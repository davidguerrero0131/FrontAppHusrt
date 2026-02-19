import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IndustrialesNavbarComponent } from '../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
  selector: 'app-homeadminindustriales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homesadminindustriales.component.html',
  styleUrl: './homesadminindustriales.component.css'
})
export class homeadminindustrialescomponent {

  router = inject(Router);

  constructor() { }

  showViewGestionOperativa() {
    this.router.navigate(['/industriales/gestion-operativa']);
  }

  showViewParametrizacion() {
    this.router.navigate(['/industriales/parametrizacion']);
  }
}
