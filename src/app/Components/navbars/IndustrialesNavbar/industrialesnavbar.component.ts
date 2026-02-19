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

  checkRole() {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      if (token) {
        const decoded: any = this.getDecodedAccessToken(token);
        const role = decoded?.rol;

        // Hide if SuperAdmin (because SuperAdmin has their own navbar)
        // Show only for Industrial roles
        if (role === 'SUPERADMIN') {
          this.isVisible = false;
        } else if (role === 'INDUSTRIALESADMIN' || role === 'INDUSTRIALESUSER' || role === 'INDUSTRIALESTECNICO') {
          this.isVisible = true;
        } else {
          // Default behavior for other roles? Maybe hide for now to be safe, or show?
          // User said "unicamente con el rol de industrialesadmin" (and likely other industrial roles)
          this.isVisible = false;
        }

        if (role === 'INDUSTRIALESUSER') {
          this.homeLink = '/industriales/gestion-operativa';
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
      sessionStorage.setItem('utoken', "");
    }
    this.router.navigate(['/login'])
  }

  viewUser() {
    this.router.navigate(['/updateprofil']);
  }
}