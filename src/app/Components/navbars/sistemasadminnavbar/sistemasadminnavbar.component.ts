import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-sistemasadminnavbar',
  standalone: true,
  imports: [MenubarModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule],
  templateUrl: './sistemasadminnavbar.component.html',
  styleUrl: './sistemasadminnavbar.component.css'
})
export class SistemasadminnavbarComponent implements OnInit {

  items: MenuItem[] = [];
  items: MenuItem[] | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/adminsistemas'])
      }
    ];
  }

  logout() {
    localStorage.removeItem('utoken');
    this.router.navigate(['/login']);
        routerLink: '/adminsistemas'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/admusuarios'
      },
      // Add more items here if discovered
    ];
  }

  navigateToAbout() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('utoken', "");
    }
    this.router.navigate(['/login'])
  }
}
