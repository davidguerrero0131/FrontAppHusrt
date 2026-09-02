import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ThemeService } from '../../../Services/theme/theme.service';
import { MesaService } from '../../../Services/mesa-servicios/mesa.service';
import { interval, Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule, BadgeModule, OverlayPanelModule],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent implements OnInit, OnDestroy {
  userService = inject(UserService);

  items: MenuItem[] | undefined;
  themeService = inject(ThemeService);
  mesaService = inject(MesaService);
  
  pendingCasesCount: number = 0;
  notificaciones: any[] = [];
  private pollingSub?: Subscription;
  
  userName: string = 'Usuario';
  userRole: string = 'Rol no definido';
  userData: any = {};

  constructor(private router: Router) { }

  ngOnInit() {
    let modulosMenu: MenuItem[] = [];
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      let idUserToFetch = sessionStorage.getItem('idUser');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          this.userData = decoded;
          this.userName = decoded.nombres ? (decoded.nombres + ' ' + (decoded.apellidos || '')) : (decoded.usuario || 'Usuario');
          this.userRole = decoded.rol || 'N/A';
          
          if (decoded.id) {
             idUserToFetch = decoded.id;
          }

          if (decoded.modulos) {
            modulosMenu = decoded.modulos.map((m: any) => ({
              label: m.nombre,
              icon: 'pi pi-arrow-up-right',
              routerLink: m.ruta
            }));
          }
        } catch(e) {}
      }

      if (idUserToFetch && idUserToFetch !== '0') {
        this.userService.getUserProfil(idUserToFetch).then((profile: any) => {
          if (profile) {
            // Actualizar la userData con los detalles completos de la base de datos
            this.userData = { ...this.userData, ...profile };
            this.userName = profile.nombres ? (profile.nombres + ' ' + (profile.apellidos || '')) : this.userName;
            this.userRole = profile.cargo?.nombre || profile.cargo || profile.nombre_cargo || this.userRole;
          }
        }).catch(err => console.error("Error al obtener perfil", err));
      } else if (idUserToFetch === '0') {
        this.userName = 'Invitado';
        this.userRole = 'INVITADO';
      }
    }

    const menuItems: MenuItem[] = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/homeuser'
      }
    ];

    if (modulosMenu.length > 0) {
      menuItems.push({
        label: 'Módulos',
        icon: 'pi pi-th-large',
        items: modulosMenu
      });
    }

    menuItems.push(
      {
        label: 'Mesa de Servicios',
        icon: 'pi pi-ticket',
        routerLink: '/mesaservicios/casos'
      },
      {
        label: 'Portal Interno',
        icon: 'pi pi-building',
        routerLink: '/interno'
      }
    );

    this.items = menuItems;

    this.mesaService.notificationsUpdated.subscribe(() => this.fetchPendingCount());
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  startPolling() {
    this.fetchPendingCount();
    this.pollingSub = interval(60000).subscribe(() => this.fetchPendingCount());
  }

  fetchPendingCount() {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('utoken')) {
      this.mesaService.getCasosNotificaciones().subscribe({
        next: (res: any) => {
          this.pendingCasesCount = res.count || 0;
          this.notificaciones = res.notificaciones || [];
        },
        error: (err) => console.error('Notifications Error', err)
      });
    }
  }

  viewPendingCases() {
    this.router.navigate(['/mesaservicios/casos']);
  }

  viewCase(casoId: number | string) {
    this.router.navigate(['/mesaservicios/casos', casoId]);
  }

  navigateToAbout() {
    this.userService.logout();
  }

  viewUser() {
    this.router.navigate(['/updateprofil']);
  }
}
