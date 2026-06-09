import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChequeosIndustrialesService } from '../../../../Services/chequeos-industriales.service';
import { IndustrialesNavbarComponent } from '../../../navbars/IndustrialesNavbar/industrialesnavbar.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-equipos-sin-chequeo',
    standalone: true,
    imports: [CommonModule, FormsModule, IndustrialesNavbarComponent],
    templateUrl: './equipos-sin-chequeo.component.html',
    styleUrls: ['./equipos-sin-chequeo.component.css']
})
export class EquiposSinChequeoComponent implements OnInit {

    router = inject(Router);
    chequeosService = inject(ChequeosIndustrialesService);

    faltantesHoy: any[] = [];
    loading = true;
    fechaHoy: string = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    tiposDisponibles = [
        { identificador: 'UPS', label: 'UPS' },
        { identificador: 'PLANTAS_ELECTRICAS', label: 'Plantas Eléctricas' },
        { identificador: 'CALDERAS', label: 'Calderas' },
        { identificador: 'TRANSFERENCIAS', label: 'Transferencias' },
        { identificador: 'TRANSFORMADORES', label: 'Transformadores' },
        { identificador: 'BOMBAS_AGUA', label: 'Bombas de Agua' },
    ];

    tipoLabels: Record<string, string> = {
        'UPS': 'UPS',
        'PLANTAS_ELECTRICAS': 'Plantas Eléctricas',
        'CALDERAS': 'Calderas',
        'TRANSFERENCIAS': 'Transferencias',
        'TRANSFORMADORES': 'Transformadores',
        'BOMBAS_AGUA': 'Bombas de Agua',
    };

    async ngOnInit() {
        try {
            const data = await this.chequeosService.obtenerFaltantesHoy().toPromise() ?? [];
            this.faltantesHoy = data.map((d: any) => ({ ...d, tipoIdentificadorSeleccionado: '' }));
        } catch (e) {
            console.warn('No se pudo cargar la lista de faltantes', e);
            this.faltantesHoy = [];
        } finally {
            this.loading = false;
        }
    }

    async asignarTipo(item: any) {
        const sel = item.tipoIdentificadorSeleccionado;
        if (!sel) return;
        const tipo = this.tiposDisponibles.find(t => t.identificador === sel);
        try {
            await this.chequeosService.asignarTipoChequeo(item.equipoId, sel).toPromise();
            item.tipoIdentificador = sel;
            item.tipoLabel = tipo?.label ?? sel;
            Swal.fire({ icon: 'success', title: 'Tipo asignado', text: `${item.nombre} ahora está en ${tipo?.label}`, timer: 2000, showConfirmButton: false });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo asignar el tipo.' });
        }
    }

    goToChequeoDiario(tipo: string) {
        this.router.navigate(['/industriales/chequeos/diarios'], { queryParams: { equipo: tipo } });
    }

    regresar() {
    window.history.back();
  }

    get totalPorTipo(): { tipo: string; label: string; count: number }[] {
        const map = new Map<string, number>();
        for (const item of this.faltantesHoy) {
            map.set(item.tipoIdentificador, (map.get(item.tipoIdentificador) ?? 0) + 1);
        }
        return Array.from(map.entries()).map(([tipo, count]) => ({
            tipo,
            label: this.tipoLabels[tipo] ?? tipo,
            count
        }));
    }
}
