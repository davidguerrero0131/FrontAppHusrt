
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-biomedicatecniconavbar',
    standalone: true,
    imports: [MenubarModule, CommonModule, AvatarModule, ButtonModule, TooltipModule, RouterModule],
    templateUrl: './biomedicatecniconavbar.component.html',
    styleUrl: './biomedicatecniconavbar.component.css'
})
export class BiomedicatecniconavbarComponent implements OnInit {

    items: MenuItem[] | undefined;
    router = inject(Router);

    ngOnInit() {
        this.items = [
            {
                label: 'Inicio',
                icon: 'pi pi-home',
                routerLink: '/biomedica/home-invitado' // Or a specific tech home? Usually home-invitado is fine or unified list. User said "Inventario" is classified.
                // Let's point Home to Inventario for Tech as they are operational?
                // Or keep consistent with others. Let's use getHomeLink() logic if needed, or simple static.
                // User said "Inicio" for User is homeuserbiomedica. For Tech?
                // I'll stick to '/biomedica/inventario' or the list? 
                // User said "Inventory classified". 
                // Let's set Home to '/biomedica/inventario' for now as it's their main workspace.
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
