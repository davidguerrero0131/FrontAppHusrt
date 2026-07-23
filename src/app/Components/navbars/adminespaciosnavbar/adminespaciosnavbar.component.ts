import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../Services/theme/theme.service';
import { BadgeModule } from 'primeng/badge';
import { MesaService } from '../../../Services/mesa-servicios/mesa.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-adminespaciosnavbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule, OverlayPanelModule, BadgeModule],
  templateUrl: './adminespaciosnavbar.component.html',
  styleUrl: './adminespaciosnavbar.component.css'
})
export class AdminespaciosnavbarComponent implements OnInit, OnDestroy {
    userService = inject(UserService);
    themeService = inject(ThemeService);
    mesaService = inject(MesaService);

    items: MenuItem[] | undefined;
    
    pendingCasesCount: number = 0;
    notificaciones: any[] = [];
    private pollingSub?: Subscription;

    constructor(private router: Router) { }

    ngOnInit() {
      this.items = [
        {
          label: 'Inicio',
          icon: 'pi pi-home',
          routerLink: '/adminespacios'
        },
        {
          label: 'Gestión de Reservas',
          icon: 'pi pi-calendar',
          routerLink: '/adminespacios/gestion-reservas'
        },
        {
          label: 'Mesa de Servicios',
          icon: 'pi pi-briefcase',
          routerLink: '/adminmesaservicios/casos'
        }
      ];

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
      this.router.navigate(['/adminmesaservicios/casos']);
    }

    navigateToAbout() {
        this.userService.logout();
    }
}
