import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../Services/theme/theme.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';

@Component({
  selector: 'app-citaspediatriaadminnavbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './citaspediatriaadminnavbar.component.html',
  styleUrls: ['./citaspediatriaadminnavbar.component.css']
})
export class CitaspediatriaadminnavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  router = inject(Router);
  themeService = inject(ThemeService);
  userService = inject(UserService);

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/servinte/citasmadrecanguro'
      },
      {
        label: 'Creación de Citas',
        icon: 'pi pi-calendar-plus',
        routerLink: '/servinte/citasmadrecanguro/creacion'
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: '/servinte/citasmadrecanguro/stats'
      }
    ];
  }

  navigateToAbout() {
    this.userService.logout();
  }
}
