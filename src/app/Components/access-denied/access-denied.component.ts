import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-access-denied',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule],
    templateUrl: './access-denied.component.html',
    styleUrl: './access-denied.component.css'
})
export class AccessDeniedComponent {
    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }
}
