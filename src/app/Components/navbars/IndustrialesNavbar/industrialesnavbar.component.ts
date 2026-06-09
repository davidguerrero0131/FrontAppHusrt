import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-industriales-navbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './industrialesnavbar.component.html',
  styleUrls: ['./industrialesnavbar.component.css']
})
export class IndustrialesNavbarComponent implements OnInit {

  items: MenuItem[] | undefined;
  router = inject(Router);
  homeLink: string = '/adminindustriales';
  isVisible: boolean = false;

  ngOnInit() {
    this.checkRole();
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: this.homeLink
      },
      {
        label: 'Gestión Operativa',
        icon: 'pi pi-briefcase',
        items: [
          { label: 'Inventario', icon: 'pi pi-box', routerLink: '/adminequipos' },
          { label: 'Mantenimiento', icon: 'pi pi-wrench', routerLink: '/industriales/gestion-mantenimientos' },
          { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/industriales/ver-programacion' }
        ]
      }
    ];
  }

  displayRole: string = '';

  checkRole() {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      if (token) {
        const decoded: any = this.getDecodedAccessToken(token);
        const role = decoded?.rol;

        if (role === 'SUPERADMIN') {
          this.displayRole = 'Súper Administrador';
        } else if (role === 'ADMINMANTENIMIENTO') {
          this.displayRole = 'Administrador de Mantenimiento';
        } else if (role === 'TECNICOMANTENIMIENTO') {
          this.displayRole = 'Técnico de Mantenimiento';
        } else if (role === 'USERMANTENIMIENTO') {
          this.displayRole = 'Usuario de Mantenimiento';
        } else {
          this.displayRole = role;
        }

        if (role === 'SUPERADMIN' || role === 'ADMINMANTENIMIENTO' || role === 'USERMANTENIMIENTO' || role === 'TECNICOMANTENIMIENTO') {
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }

        if (role === 'ADMINMANTENIMIENTO' || role === 'USERMANTENIMIENTO' || role === 'SUPERADMIN') {
          this.homeLink = '/adminmantenimiento';
        } else if (role === 'TECNICOMANTENIMIENTO' || role === 'USERMANTENIMIENTO') {
          this.homeLink = '/adminmantenimiento/gestion-operativa';
        }
      } else {
        this.isVisible = false;
      }
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  navigateToAbout() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('utoken');
    }
    localStorage.removeItem('utoken');
    this.router.navigate(['/login']);
  }

  viewUser() {
    this.router.navigate(['/updateprofil']);
  }
}