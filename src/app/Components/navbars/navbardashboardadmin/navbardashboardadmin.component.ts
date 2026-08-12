import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../Services/theme/theme.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbardashboardadmin',
  standalone: true,
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule, OverlayPanelModule],
  templateUrl: './navbardashboardadmin.component.html',
  styleUrl: './navbardashboardadmin.component.css'
})
export class NavbardashboardadminComponent implements OnInit {
  userService = inject(UserService);
  items: MenuItem[] | undefined;
  themeService = inject(ThemeService);

  constructor(private router: Router) { }

  ngOnInit() {
    let mesaRoute = '/mesauser/home';
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const mesaRol = decoded.mesaRol ? decoded.mesaRol.toUpperCase().replace(/\s+/g, '') : null;
          if (mesaRol === 'MESAADMIN') {
            mesaRoute = '/adminmesaservicios';
          }
        } catch (e) {}
      }
    }

    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/dashboardadmin'
      },
      {
        label: 'Gestión Tableros',
        icon: 'pi pi-chart-bar',
        routerLink: '/dashboardadmin/powerbi'
      },
      {
        label: 'Mesa de Servicios',
        icon: 'pi pi-briefcase',
        routerLink: mesaRoute
      }
    ];
    if (this.items) { this.items.push({ label: 'Portal Interno', icon: 'pi pi-building', routerLink: '/interno' }); }
  }

  navigateToAbout() {
    this.userService.logout();
  }
}
