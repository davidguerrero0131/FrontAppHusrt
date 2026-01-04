import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadminnavbar',
  standalone: true,
  imports: [],
  templateUrl: './superadminnavbar.component.html',
  styleUrls: ['./superadminnavbar.component.css']
})
export class SuperadminnavbarComponent {

    @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  constructor(private router: Router){}
  navigateToAbout() {
    localStorage.removeItem('utoken'); // 👈 Mejor práctica para el logout
    this.router.navigate(['/login']);
  }
}
