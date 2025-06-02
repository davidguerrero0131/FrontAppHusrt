import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-biomedicausernavbar',
  standalone: true,
  imports: [MenubarModule, BadgeModule, CommonModule, AvatarModule, Sidebar, ButtonModule, PanelMenuModule],
  templateUrl: './biomedicausernavbar.component.html',
  styleUrl: './biomedicausernavbar.component.css'
})
export class BiomedicausernavbarComponent implements OnInit {

   items!: MenuItem[];

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e: any): void {
        this.sidebarRef.close(e);
    }

    sidebarVisible: boolean = false;

  constructor(private router: Router){}

  navigateToAbout(){
    localStorage.setItem('utoken', "");
    this.router.navigate(['/login'])
  }

  viewUser(){
    this.router.navigate(['/updateprofil'])
  }

  getDecodedAccessToken(token: string): any {
      try {
        return jwtDecode(token);
      } catch (Error) {
        return null;
      }
    }


    ngOnInit() {
        this.items = [
            {
                label: 'Mail',
                icon: 'pi pi-envelope',
                badge: '5',
                items: [
                    {
                        label: 'Compose',
                        icon: 'pi pi-file-edit',
                        shortcut: '⌘+N'
                    },
                    {
                        label: 'Inbox',
                        icon: 'pi pi-inbox',
                        badge: '5'
                    },
                    {
                        label: 'Sent',
                        icon: 'pi pi-send',
                        shortcut: '⌘+S'
                    },
                    {
                        label: 'Trash',
                        icon: 'pi pi-trash',
                        shortcut: '⌘+T'
                    }
                ]
            },
            {
                label: 'Reports',
                icon: 'pi pi-chart-bar',
                shortcut: '⌘+R',
                items: [
                    {
                        label: 'Sales',
                        icon: 'pi pi-chart-line',
                        badge: '3'
                    },
                    {
                        label: 'Products',
                        icon: 'pi pi-list',
                        badge: '6'
                    }
                ]
            },
            {
                label: 'Profile',
                icon: 'pi pi-user',
                shortcut: '⌘+W',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        shortcut: '⌘+O'
                    },
                    {
                        label: 'Privacy',
                        icon: 'pi pi-shield',
                        shortcut: '⌘+P'
                    }
                ]
            }
        ];
    }

    toggleAll() {
        const expanded = !this.areAllItemsExpanded();
        this.items = this.toggleAllRecursive(this.items, expanded);
    }

    private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
        return items.map((menuItem) => {
            menuItem.expanded = expanded;
            if (menuItem.items) {
                menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
            }
            return menuItem;
        });
    }

    private areAllItemsExpanded(): boolean {
        return this.items.every((menuItem) => menuItem.expanded);
    }

}
