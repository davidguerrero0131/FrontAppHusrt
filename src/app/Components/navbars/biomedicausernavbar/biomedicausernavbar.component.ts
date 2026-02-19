import { Component, OnInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-biomedicausernavbar',
    standalone: true,
    imports: [MenubarModule, BadgeModule, CommonModule, AvatarModule, SidebarModule, ButtonModule, PanelMenuModule, RouterModule],
    templateUrl: './biomedicausernavbar.component.html',
    styleUrls: ['./biomedicausernavbar.component.css']
    imports: [MenubarModule, BadgeModule, CommonModule, AvatarModule, ButtonModule, PanelMenuModule, RouterModule],
    templateUrl: './biomedicausernavbar.component.html',
    styleUrl: './biomedicausernavbar.component.css'
})
export class BiomedicausernavbarComponent implements OnInit {

    items!: MenuItem[];
    sidebarVisible: boolean = false;

    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    constructor(private router: Router) { }
    userRole: string = '';

    constructor(private router: Router) { }

    navigateToAbout() {
        sessionStorage.setItem('utoken', "");
        this.router.navigate(['/login'])
    }

    viewUser() {
        this.router.navigate(['/updateprofil']);
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    getHomeLink(): string {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded: any = this.getDecodedAccessToken(token);
            if (decoded?.rol === 'INVITADO') {
                return '/biomedica/home-invitado';
            }
        }
        return '/userbiomedica';
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Equipos',
                icon: 'pi pi-cog',
                items: [
                    {
                        label: 'Listado',
                        icon: 'pi pi-list',
                        command: () => this.router.navigate(['/userbiomedica/equipos'])
                    }
                ]
            },
            {
                label: 'Reportes',
                icon: 'pi pi-file',
                items: [
                    {
                        label: 'Mis Reportes',
                        icon: 'pi pi-folder',
                        command: () => this.router.navigate(['/userbiomedica/reportes'])
                    }
                ]
                label: 'Inicio',
                icon: 'pi pi-home',
                routerLink: this.getHomeLink()
            }
        ];

        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded: any = this.getDecodedAccessToken(token);
            this.userRole = decoded?.rol;
            const userRole = this.userRole;

            // Menu for BIOMEDICAUSER and others (excluding INVITADO)
            if (userRole !== 'INVITADO') {
                if (userRole === 'BIOMEDICATECNICO') {
                    // Technical Role Menu
                    this.items.push(
                        {
                            label: 'Gestion Operativa',
                            icon: 'pi pi-briefcase',
                            items: [
                                {
                                    label: 'Inventario',
                                    icon: 'pi pi-list',
                                    routerLink: '/biomedica/tecnico/equipos'
                                },
                                {
                                    label: 'Mantenimiento Técnico',
                                    icon: 'pi pi-wrench',
                                    routerLink: '/biomedica/tecnico/mantenimiento'
                                },
                                {
                                    label: 'Indicadores',
                                    icon: 'pi pi-chart-bar',
                                    routerLink: '/biomedica/indicadores'
                                },
                                {
                                    label: 'Metrologia',
                                    icon: 'pi pi-verified',
                                    routerLink: '/biomedica/actividadesmetrologicas'
                                }
                            ]
                        }
                    );
                } else {
                    // Standard User / Admin Menu
                    this.items.push(
                        {
                            label: 'Gestion Operativa',
                            icon: 'pi pi-briefcase',
                            items: [
                                {
                                    label: 'Inventario',
                                    icon: 'pi pi-list',
                                    routerLink: '/biomedica/inventario'
                                },
                                {
                                    label: 'Mantenimiento',
                                    icon: 'pi pi-cog',
                                    routerLink: '/biomedica/mantenimiento'
                                },
                                {
                                    label: 'Mantenimiento Técnico',
                                    icon: 'pi pi-wrench',
                                    routerLink: '/biomedica/mantenimientotecnico',
                                    visible: userRole === 'SUPERADMIN' || userRole === 'BIOMEDICAADMIN'
                                },
                                {
                                    label: 'Semaforización',
                                    icon: 'pi pi-exclamation-circle',
                                    routerLink: '/biomedica/semaforizacion'
                                },
                                {
                                    label: 'Indicadores',
                                    icon: 'pi pi-chart-bar',
                                    routerLink: '/biomedica/indicadores'
                                },
                                {
                                    label: 'Calendario',
                                    icon: 'pi pi-calendar',
                                    routerLink: '/biomedica/calendario'
                                },
                                {
                                    label: 'Metrologia',
                                    icon: 'pi pi-verified',
                                    routerLink: '/biomedica/actividadesmetrologicas'
                                }
                            ]
                        }
                    );
                }
            }
        }
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

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }
}
