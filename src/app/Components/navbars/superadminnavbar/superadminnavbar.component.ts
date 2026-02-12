import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-superadminnavbar',
  standalone: true,
  imports: [MenubarModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './superadminnavbar.component.html',
  styleUrl: './superadminnavbar.component.css'
})
export class SuperadminnavbarComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        command: () => this.router.navigate(['/admusuarios'])
      }
    ];
  }

  logout() {
    localStorage.removeItem('utoken');
    this.router.navigate(['/login']);
  }

  viewUser() {
    this.router.navigate(['/updateprofil']);
  }
}
