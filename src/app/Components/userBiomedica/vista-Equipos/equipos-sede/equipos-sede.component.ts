
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { SedeService } from '../../../../Services/appServices/general/sede/sede.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { getDecodedAccessToken, obtenerNombreMes } from '../../../../utilidades';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HistorialEquiposComponent } from '../historial-equipos/historial-equipos.component';

@Component({
    selector: 'app-equipos-sede',
    standalone: true,
    imports: [FormsModule, CommonModule, TableModule,
        SplitButtonModule, SpeedDialModule, IconFieldModule, InputIconModule, InputTextModule],
    providers: [DialogService],
    templateUrl: './equipos-sede.component.html',
    styleUrl: './equipos-sede.component.css'
})
export class EquiposSedeComponent implements OnInit {

    @ViewChild('dt2') dt2!: Table;
    equipos!: any[];
    sede!: any;
    loading: boolean = false;
    ref: DynamicDialogRef | undefined;

    equipoServices = inject(EquiposService);
    sedeServices = inject(SedeService);

    constructor(
        private router: Router,
        public dialogService: DialogService
    ) { }

    async ngOnInit() {
        const idSede = sessionStorage.getItem('idSede');
        if (idSede) {
            this.loading = true;
            try {
                const equiposData = await this.equipoServices.getAllEquiposSede(idSede);
                this.sede = await this.sedeServices.getSedeById(idSede);

                this.equipos = equiposData.map((equipo: any) => ({
                    ...equipo,
                    opcionesHV: [
                        {
                            label: 'Editar',
                            icon: 'pi pi-pencil',
                            command: () => this.editarEquipo(equipo.id),
                            visible: getDecodedAccessToken().rol === 'BIOMEDICAADMIN'
                        },
                        {
                            label: 'Ver Hoja de Vida',
                            icon: 'pi pi-eye',
                            command: () => this.verHojaVida(equipo.id)
                        },
                        {
                            label: 'Reportes',
                            icon: 'pi pi-external-link',
                            command: () => this.verReportes(equipo.id)
                        },
                        {
                            label: 'Nuevo reporte',
                            icon: 'pi pi-upload',
                            command: () => this.nuevoReporte(equipo.id),
                            visible: getDecodedAccessToken().rol !== 'INVITADO'
                        },
                        {
                            label: 'Historial',
                            icon: 'pi pi-history',
                            command: () => this.verHistorial(equipo.id)
                        }
                    ]
                }));
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            this.dt2.filterGlobal(target.value, 'contains');
        }
    }

    verHojaVida(id: number) {
        this.router.navigate(['biomedica/hojavidaequipo/', id]);
    }

    editarEquipo(id: number) {
        // Implement edit logic if needed or reused
    }

    nuevoReporte(id: number) {
        sessionStorage.setItem('TipoMantenimiento', 'C');
        this.router.navigate(['biomedica/nuevoreporte/', id]);
    }

    verReportes(id: number) {
        this.router.navigate(['biomedica/reportesequipo/', id]);
    }

    verHistorial(id: number) {
        this.ref = this.dialogService.open(HistorialEquiposComponent, {
            header: 'Historial de Cambios',
            width: '50vw',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: {
                idEquipo: id
            }
        });
    }

    obtenerMesesTexto(planes: any[]): string {
        if (!planes || planes.length === 0) {
            return 'Sin programación';
        }
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        // Filter duplicates and sort
        const uniqueMeses = [...new Set(planes.map(p => p.mes))].sort((a: any, b: any) => a - b);

        return uniqueMeses.map((m: any) => meses[m]).join(', ');
    }

    obtenerColorRiesgo(riesgo: string): string {
        switch (riesgo) {
            case 'I': return '#4caf50'; // Verde
            case 'IIA': return '#90EE90'; // Verde claro
            case 'IIB': return '#ffff00'; // Amarillo
            case 'III': return '#ffcc80'; // Naranja claro
            default: return 'transparent';
        }
    }
}
