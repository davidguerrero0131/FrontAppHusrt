import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chequeos-turnos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chequeos-turnos.component.html',
    styleUrls: ['./chequeos-turnos.component.css']
})
export class ChequeosTurnosComponent {
    router = inject(Router);

    regresar() {
        this.router.navigate(['/industriales/chequeos']);
    }
}
