
import { Component, OnInit, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-historial-equipos',
    standalone: true,
    imports: [CommonModule, TimelineModule, CardModule, TableModule],
    templateUrl: './historial-equipos.component.html',
    styleUrls: ['./historial-equipos.component.css']
})
export class HistorialEquiposComponent implements OnInit {

    @Input() idEquipoInput: any;
    events: any[] = [];
    idEquipo: any;

    constructor(
        private equiposService: EquiposService,
        @Optional() public config: DynamicDialogConfig,
        @Optional() public ref: DynamicDialogRef
    ) { }

    async ngOnInit() {
        if (this.config?.data?.idEquipo) {
            this.idEquipo = this.config.data.idEquipo;
        } else if (this.idEquipoInput) {
            this.idEquipo = this.idEquipoInput;
        }

        if (this.idEquipo) {
            await this.loadHistorial();
        }
    }

    async loadHistorial() {
        try {
            const rawEvents = await this.equiposService.getTrazabilidadByEquipo(this.idEquipo);
            this.events = rawEvents.map((event: any) => {
                let parsedDetalles = event.detalles;
                try {
                    parsedDetalles = JSON.parse(event.detalles);
                } catch (e) {
                    // Keep as string if parsing fails
                }

                let icon = 'pi pi-info-circle';
                let color = '#9E9E9E'; // Grey default

                switch (event.accion) {
                    case 'EDICIÓN':
                    case 'EDICIÓN DE PROGRAMACIÓN DE MANTENIMIENTO PREVENTIVO':
                    case 'ACTUALIZACIÓN HOJA DE VIDA':
                    case 'ACTUALIZACIÓN PLAN METROLOGÍA':
                    case 'ACTUALIZACIÓN PLAN MANTENIMIENTO':
                        icon = 'pi pi-pencil';
                        color = '#FF9800'; // Orange
                        break;
                    case 'CREACION':
                    case 'NUEVO REPORTE':
                        icon = 'pi pi-plus';
                        color = '#4CAF50'; // Green
                        break;
                    default:
                        break;
                }

                return {
                    ...event,
                    detalles: parsedDetalles,
                    icon,
                    color
                };
            });
        } catch (error) {
            console.error("Error loading historial", error);
        }
    }

    isObject(val: any): boolean {
        return val && typeof val === 'object' && !Array.isArray(val);
    }

    objectKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }
}
