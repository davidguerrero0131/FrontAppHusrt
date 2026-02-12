import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mantenimientoadminnavbar',
  standalone: true,
  imports: [MenubarModule, BadgeModule, CommonModule, AvatarModule, SidebarModule, ButtonModule, PanelMenuModule, RouterModule],
  templateUrl: './mantenimientoadminnavbar.component.html',
  styleUrls: ['./mantenimientoadminnavbar.component.css']
})
export class MantenimientoadminnavbarComponent implements OnInit {

  items!: MenuItem[];
  sidebarVisible: boolean = false;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Áreas Físicas',
        icon: 'pi pi-building',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-list',
            command: () => this.router.navigate(['/areas/listado'])
          },
          {
            label: 'Nueva Área',
            icon: 'pi pi-plus',
            command: () => this.router.navigate(['/areas/crear'])
          },
          {
            label: 'Asignar Elementos',
            icon: 'pi pi-link',
            command: () => this.router.navigate(['/areas/asignar-elementos'])
          }
        ]
      },
      {
        label: 'Elementos',
        icon: 'pi pi-box',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-list',
            command: () => this.router.navigate(['/elementos/listado'])
          },
          {
            label: 'Nuevo Elemento',
            icon: 'pi pi-plus',
            command: () => this.router.navigate(['/elementos/crear'])
          }
        ]
      },
      {
        label: 'Planes Mantenimiento',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-list',
            command: () => this.router.navigate(['/areas/planes/listado'])
          },
          {
            label: 'Nuevo Plan',
            icon: 'pi pi-plus',
            command: () => this.router.navigate(['/areas/planes/crear'])
          }
        ]
      },
      {
        label: 'Inspecciones',
        icon: 'pi pi-check-circle',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-list',
            command: () => this.router.navigate(['/areas/inspecciones/listado'])
          },
          {
            label: 'Nueva Inspección',
            icon: 'pi pi-plus',
            command: () => this.router.navigate(['/areas/inspecciones/crear'])
          }
        ]
      }
    ];
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  logout() {
    localStorage.removeItem('utoken');
    this.router.navigate(['/login']);
  }

  viewUser() {
    this.router.navigate(['/updateprofil']);
  }
}
