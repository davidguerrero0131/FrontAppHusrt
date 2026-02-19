import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquiposService } from '../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-clasificacion-riesgos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './clasificacion-riesgos.component.html',
    styleUrl: './clasificacion-riesgos.component.css'
})
export class ClasificacionRiesgosComponent implements OnInit {

    equiposService = inject(EquiposService);
    router = inject(Router);

    riesgos = ['I', 'IIA', 'IIB', 'III', 'NA'];
    cantidadesEquipos: { [key: string]: number } = {};

    async ngOnInit() {
        // We could optimize this by creating a specific backend endpoint for counts, 
        // but for now we'll iterate or just show the cards.
        // Given the previous pattern in 'ClasificacionServicio', they iterate services and get counts.
        // Here keys are fixed. Let's try to get counts if possible, or just show the cards.
        // Since we don't have a count endpoint yet, we will just display the cards.
        // Optionally we could fetch all equipments and count them, but that might be heavy.
        // For now, let's just show the cards.

        // Attempt to fetch counts (Optional improvement)
        // this.items = await this.equiposService.getAllEquipos(); 
        // this.riesgos.forEach(r => this.cantidadesEquipos[r] = this.items.filter(e => e.riesgo === r).length);
    }

    viewEquiposRiesgo(riesgo: string) {
        sessionStorage.setItem("riesgoSelected", riesgo);
        this.router.navigate(['biomedica/equiposriesgo']);
    }

    obtenerColor(riesgo: string): string {
        switch (riesgo) {
            case 'I': return 'gradient-green';
            case 'IIA': return 'gradient-teal';
            case 'IIB': return 'gradient-yellow';
            case 'III': return 'gradient-orange';
            case 'NA': return 'gradient-gray';
            default: return 'gradient-blue';
        }
    }
}
