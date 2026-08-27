import { AppNavbarComponent } from '../../../../navbars/app-navbar/app-navbar.component';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-reporte-options',
  standalone: true,
  imports: [CommonModule, ButtonModule, AppNavbarComponent],
  templateUrl: './reporte-options.component.html',
  styleUrls: ['./reporte-options.component.css']
})
export class ReporteOptionsComponent {
  private router = inject(Router);

  backToDashboard() {
    this.router.navigate(['/adminmantenimiento/gestion-operativa']);
  }

  goToReportesPorArea() {
    // Navigate with a query param to tell the list component to focus on area flow
    this.router.navigate(['/adminmantenimiento/reportes-general'], { queryParams: { flow: 'area' } });
  }

  goToReportesPorElemento() {
    this.router.navigate(['/adminmantenimiento/reportes-general'], { queryParams: { flow: 'elemento' } });
  }
}
