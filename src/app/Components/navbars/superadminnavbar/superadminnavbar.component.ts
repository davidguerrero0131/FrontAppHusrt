import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-superadminnavbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './superadminnavbar.component.html',
  styleUrl: './superadminnavbar.component.css'
})
export class SuperadminnavbarComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/superadmin'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/admusuarios'
      },
      {
        label: 'Equipos',
        icon: 'pi pi-server',
        routerLink: '/biomedica/adminequipos'
      },
      {
        label: 'Servicios',
        icon: 'pi pi-list',
        routerLink: '/admservicios'
      },
      {
        label: 'Tipos Equipo',
        icon: 'pi pi-tags',
        routerLink: '/admtiposequipo'
      }
    ];
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
