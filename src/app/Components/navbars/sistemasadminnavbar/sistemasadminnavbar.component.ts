import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sistemasadminnavbar',
  standalone: true,
  imports: [MenubarModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './sistemasadminnavbar.component.html',
  styleUrl: './sistemasadminnavbar.component.css'
})
export class SistemasadminnavbarComponent implements OnInit {

  items: MenuItem[] = [];

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
  }
}
