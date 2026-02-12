import { Component, OnInit, ViewChild } from '@angular/core';
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
})
export class BiomedicausernavbarComponent implements OnInit {

    items!: MenuItem[];
    sidebarVisible: boolean = false;

    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    constructor(private router: Router) { }

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

    getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }
}
