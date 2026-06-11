import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MesaadminnavbarComponent } from '../../navbars/mesaadminnavbar/mesaadminnavbar.component';
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
  isTiServiceAdmin: boolean = false;

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

      if (this.userId) {
        this.userService.getUserProfil(this.userId).then((user: any) => {
          if (user && user.mesaServicioRolId === 1 && Number(user.servicioId) === 45) {
             this.isTiServiceAdmin = true;
          }
        }).catch((err: any) => console.error("Error fetching user profile", err));
      }
    }
  }

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
