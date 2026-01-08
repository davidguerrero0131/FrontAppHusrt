
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
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-equipos-sede',
    standalone: true,
    imports: [FormsModule, CommonModule, TableModule,
        SplitButtonModule, SpeedDialModule, IconFieldModule, InputIconModule, InputTextModule, DialogModule, MultiSelectModule, DropdownModule, InputNumberModule, ButtonModule],
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

    // Variables para el modal de edición de plan
    displayPlanDialog: boolean = false;
    currentEquipo: any = null;
    selectedMonths: any[] = [];
    periodicidad: number = 0;
    mesInicio: number = 1;
    calculatedMonthsText: string = '';

    monthOptions: any[] = [
        { name: 'Enero', value: 1 },
        { name: 'Febrero', value: 2 },
        { name: 'Marzo', value: 3 },
        { name: 'Abril', value: 4 },
        { name: 'Mayo', value: 5 },
        { name: 'Junio', value: 6 },
        { name: 'Julio', value: 7 },
        { name: 'Agosto', value: 8 },
        { name: 'Septiembre', value: 9 },
        { name: 'Octubre', value: 10 },
        { name: 'Noviembre', value: 11 },
        { name: 'Diciembre', value: 12 }
    ];

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
                            visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
                        },
                        {
                            label: 'Editar Plan Mantenimiento',
                            icon: 'pi pi-calendar',
                            command: () => this.openPlanDialog(equipo),
                            visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
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
        this.router.navigate(['biomedica/adminequipos/edit/', id]);
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

    openPlanDialog(equipo: any) {
        this.currentEquipo = equipo;
        this.displayPlanDialog = true;

        // Inicializar periodicidad
        this.periodicidad = equipo.periodicidadM || 0;

        // Determinar mes de inicio basado en el plan existente o defecto
        if (equipo.planesMantenimiento && equipo.planesMantenimiento.length > 0) {
            // Ordenar para encontrar el primero
            const meses = equipo.planesMantenimiento.map((p: any) => (typeof p === 'object' && p.mes ? p.mes : p)).sort((a: any, b: any) => a - b);
            this.mesInicio = meses[0];
            this.selectedMonths = meses;
        } else {
            this.mesInicio = 1; // Enero por defecto
            this.selectedMonths = [];
        }

        // Calcular texto inicial
        this.calcularFechas(false); // false para no sobrescribir immediately
        if (this.periodicidad > 0) {
            this.calcularFechas();
        } else {
            this.updateCalculatedText();
        }
    }

    calcularFechas(overwrite: boolean = true) {
        if (!this.periodicidad || this.periodicidad <= 0) {
            this.calculatedMonthsText = 'Periodicidad no válida';
            return;
        }

        if (overwrite) {
            const nuevosMeses = [];
            let mesActual = this.mesInicio;

            while (mesActual <= 12) {
                nuevosMeses.push(mesActual);
                mesActual += this.periodicidad;
            }
            this.selectedMonths = nuevosMeses;
        }

        this.updateCalculatedText();
    }

    updateCalculatedText() {
        if (!this.selectedMonths || this.selectedMonths.length === 0) {
            this.calculatedMonthsText = 'Sin fechas seleccionadas';
            return;
        }
        const textMeses = this.selectedMonths.sort((a, b) => a - b).map(m => {
            const op = this.monthOptions.find(o => o.value === m);
            return op ? op.name : m;
        }).join(', ');
        this.calculatedMonthsText = `Fechas programadas: ${textMeses}`;
    }

    async savePlan() {
        if (!this.currentEquipo) return;

        try {
            // Reconstruimos el array de planes basados en selectedMonths
            const nuevosPlanes = this.selectedMonths.map(mes => ({
                mes: mes
            }));

            const equipoUpdate = {
                ...this.currentEquipo,
                periodicidadM: this.periodicidad, // Guardar tambien la periodicidad
                planesMantenimiento: nuevosPlanes
            };

            await this.equipoServices.updateEquipo(this.currentEquipo.id, equipoUpdate);

            const Swal = require('sweetalert2');
            Swal.fire(
                'Actualizado!',
                'El plan de mantenimiento ha sido actualizado.',
                'success'
            );

            this.displayPlanDialog = false;
            // Recargar equipos para mostrar cambios
            const idSede = sessionStorage.getItem('idSede');
            if (idSede) {
                const equiposData = await this.equipoServices.getAllEquiposSede(idSede);
                this.equipos = equiposData.map((equipo: any) => ({
                    ...equipo,
                    opcionesHV: [
                        {
                            label: 'Editar',
                            icon: 'pi pi-pencil',
                            command: () => this.editarEquipo(equipo.id),
                            visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
                        },
                        {
                            label: 'Editar Plan Mantenimiento',
                            icon: 'pi pi-calendar',
                            command: () => this.openPlanDialog(equipo),
                            visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
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
            }
        } catch (error) {
            console.error(error);
            const Swal = require('sweetalert2');
            Swal.fire(
                'Error!',
                'Hubo un problema al actualizar el plan.',
                'error'
            );
        }
    }
}
