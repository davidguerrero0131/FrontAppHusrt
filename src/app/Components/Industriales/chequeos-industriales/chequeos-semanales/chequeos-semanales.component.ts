import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chequeos-semanales',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chequeos-semanales.component.html',
    styleUrls: ['./chequeos-semanales.component.css']
})
export class ChequeosSemanalesComponent {
    router = inject(Router);

    regresar() {
    window.history.back();
  }
}
