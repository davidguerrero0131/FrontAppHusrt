import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-biomedicausernavbar',
  standalone: true,
  imports: [MenubarModule, BadgeModule, CommonModule, AvatarModule],
  templateUrl: './biomedicausernavbar.component.html',
  styleUrl: './biomedicausernavbar.component.css'
})
export class BiomedicausernavbarComponent {

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
}
