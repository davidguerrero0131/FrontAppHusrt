import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-industriales-navbar', // ✅ Corregido con guiones
  standalone: true,
  imports: [],
  templateUrl: './industrialesnavbar.component.html',
  styleUrls: ['./industrialesnavbar.component.css']
})
export class IndustrialesNavbarComponent { // ✅ Nombre en PascalCase

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  constructor(private router: Router) {}
  
  navigateToAbout() {
    localStorage.removeItem('utoken');
    this.router.navigate(['/login']);
  }
}