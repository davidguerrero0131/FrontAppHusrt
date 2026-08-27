import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { PowerBiAdminComponent } from '../power-bi-admin/power-bi-admin.component';
import { PowerBiViewerComponent } from '../power-bi-viewer/power-bi-viewer.component';

@Component({
  selector: 'app-homepowerbi',
  standalone: true,
  imports: [CommonModule, PowerBiAdminComponent, PowerBiViewerComponent],
  templateUrl: './homepowerbi.component.html',
  styleUrls: ['./homepowerbi.component.css']
})
export class HomepowerbiComponent implements OnInit {
  role: string = '';
  isAdmin: boolean = false;
  isUser: boolean = false;

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('utoken');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const roles: string[] = decoded.roles || [decoded.rol];
          
          if (roles.includes('SUPERADMIN') || roles.includes('DASHBOARDADMIN')) {
            this.isAdmin = true;
          } else {
            this.isUser = true;
          }
        } catch(e) {}
      }
    }
  }
}
