
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
import { BadgeModule } from 'primeng/badge';
import { jwtDecode } from 'jwt-decode';
import { ThemeService } from '../../../Services/theme/theme.service';
import { MesaService } from '../../../Services/mesa-servicios/mesa.service';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-biomedicatecniconavbar',
    standalone: true,
    imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule, BadgeModule, OverlayPanelModule],
    templateUrl: './biomedicatecniconavbar.component.html',
    styleUrl: './biomedicatecniconavbar.component.css'
})
export class BiomedicatecniconavbarComponent implements OnInit, OnDestroy {
    userService = inject(UserService);

    items: MenuItem[] | undefined;
    router = inject(Router);
    themeService = inject(ThemeService);
    mesaService = inject(MesaService);
    
    pendingCasesCount: number = 0;
  notificaciones: any[] = [];
    private pollingSub?: Subscription;

    ngOnInit() {
        this.items = [
            {
                label: 'Inicio',
                icon: 'pi pi-home',
                routerLink: '/userbiomedica'
            },
            {
                label: 'Mesa de Servicios',
                icon: 'pi pi-briefcase',
                routerLink: '/adminmesaservicios/casos'
            },
            {
                label: 'Gestión Operativa',
                icon: 'pi pi-briefcase',
                items: [
                    { label: 'Inventario', icon: 'pi pi-list', routerLink: '/biomedica/inventario' },
                    {
                        label: 'Mantenimiento Técnico',
                        icon: 'pi pi-wrench',
                        routerLink: '/biomedica/tecnico/mantenimiento'
                    },
                    { label: 'Metrología', icon: 'pi pi-compass', routerLink: '/biomedica/actividadesmetrologicas' },
                    { label: 'Indicadores', icon: 'pi pi-chart-bar', routerLink: '/biomedica/indicadores' }
                ]
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

    viewUser() {
        this.router.navigate(['/updateprofil']);
    }
}
