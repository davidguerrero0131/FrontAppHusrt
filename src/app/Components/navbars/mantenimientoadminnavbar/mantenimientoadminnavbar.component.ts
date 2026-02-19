import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule, Sidebar } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-mantenimientoadminnavbar',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    AvatarModule,
    ButtonModule,
    TooltipModule,
    SidebarModule,
    PanelMenuModule,
    RouterModule
  ],
  templateUrl: './mantenimientoadminnavbar.component.html',
  styleUrl: './mantenimientoadminnavbar.component.css'
})
export class MantenimientoadminnavbarComponent implements OnInit {

  items: MenuItem[] | undefined;
  sidebarVisible: boolean = false;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/adminmantenimiento'
      },
      {
        label: 'Mesa de Servicios',
        icon: 'pi pi-briefcase',
        routerLink: '/adminmesaservicios/casos'
      },
      {
        label: 'Gestión Operativa',
        icon: 'pi pi-cog',
        items: [
          { label: 'Planes de Mantenimiento', icon: 'pi pi-calendar', routerLink: '/areas/planes/listado' },
          { label: 'Inspecciones', icon: 'pi pi-check-square', routerLink: '/areas/inspecciones/listado' },
          { label: 'Asignación de Elementos', icon: 'pi pi-link', routerLink: '/areas/asignar-elementos' }
        ]
      },
      {
        label: 'Parametrización',
        icon: 'pi pi-box',
        items: [
          {
            label: 'Áreas Físicas',
            icon: 'pi pi-building',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: '/areas/listado' },
              { label: 'Crear Nueva', icon: 'pi pi-plus', routerLink: '/areas/crear' }
            ]
          },
          {
            label: 'Elementos',
            icon: 'pi pi-box',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: '/elementos/listado' },
              { label: 'Crear Nuevo', icon: 'pi pi-plus', routerLink: '/elementos/crear' }
            ]
          },
          { separator: true },
          { label: 'Crear Plan', icon: 'pi pi-plus', routerLink: '/areas/planes/crear' },
          { label: 'Nueva Inspección', icon: 'pi pi-plus', routerLink: '/areas/inspecciones/crear' }
        ]
      }
    ];
  }

  logout() {
    localStorage.removeItem('utoken');
    this.router.navigate(['/login']);
  }

  viewUser() {
    // Navigate to profile or show user details
    // Assuming a route exists or just a placeholder for now as per previous version
    console.log('View User Profile');
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }
}
