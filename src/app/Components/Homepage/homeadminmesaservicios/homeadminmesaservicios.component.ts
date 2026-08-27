import { AppNavbarComponent } from '../../navbars/app-navbar/app-navbar.component';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../../Services/appServices/userServices/user.service';

@Component({
  selector: 'app-homeadminmesaservicios',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './homeadminmesaservicios.component.html',
  styleUrl: './homeadminmesaservicios.component.css'
})
export class HomeadminmesaserviciosComponent {

  userRole: string = '';
  userId: number | null = null;
  canViewConfig: boolean = false;
  canViewIndicadores: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.extractUser();
  }

  extractUser() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userRole = decoded.rol;
      this.userId = decoded.id || decoded.id_usuario || decoded.userId;

      const configRoles = ['SUPERADMIN'];
      const indicadoresRoles = ['SUPERADMIN', 'MESAADMIN'];

      this.canViewConfig = configRoles.includes(this.userRole);
      this.canViewIndicadores = indicadoresRoles.includes(this.userRole);
    }
  }

  viewCategorias() {
    this.router.navigate(['/mesaservicios/config/categorias']);
  }

  viewRoles() {
    this.router.navigate(['/mesaservicios/config/roles']);
  }

  viewCasos() {
    this.router.navigate(['/mesaservicios/casos']);
  }

  viewIndicadores() {
    // Placeholder for Phase 6
    // this.router.navigate(['/mesaservicios/indicadores']);
  }
}
