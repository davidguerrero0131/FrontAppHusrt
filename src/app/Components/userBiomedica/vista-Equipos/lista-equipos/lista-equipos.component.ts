import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { PermissionsService } from '../../../../Services/auth/permissions.service';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { obtenerNombreMes } from '../../../../utilidades';

@Component({
    selector: 'app-lista-equipos',
    standalone: true,
    imports: [TableModule, CommonModule, IconFieldModule,
        InputIconModule, InputTextModule, SplitButtonModule, ButtonModule, TooltipModule, ToolbarModule, TagModule,
        DialogModule, MultiSelectModule, FormsModule, DropdownModule, InputNumberModule],
    templateUrl: './lista-equipos.component.html',
    styleUrl: './lista-equipos.component.css'
})
export class ListaEquiposComponent implements OnInit {

    @ViewChild('dt2') dt2!: Table;
    equipos!: any[];
    loading: boolean = false;
    equipoServices = inject(EquiposService);
    permissionsService = inject(PermissionsService);

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

    constructor(
        private router: Router,
    ) { }

    async ngOnInit() {
        this.cargarEquipos();
    }

    async cargarEquipos() {
        this.loading = true;
        try {
            const data = await this.equipoServices.getAllEquipos();

            const canEdit = this.permissionsService.canEdit();
            const canDelete = this.permissionsService.canDelete();
            const isTecnico = this.permissionsService.isTecnico();

            this.equipos = data.map((equipo: any) => {
                const opciones: MenuItem[] = [];

                if (canEdit) {
                    opciones.push({
                        label: 'Editar',
                        icon: 'pi pi-pencil',
                        command: () => this.editarEquipo(equipo.id)
                    },
                        {
                            label: 'Editar Plan Mantenimiento',
                            icon: 'pi pi-calendar',
                            command: () => this.openPlanDialog(equipo)
                        });
                }

                if (canDelete) {
                    opciones.push({
                        label: 'Desactivar',
                        icon: 'pi pi-trash',
                        command: () => this.desactivarEquipo(equipo)
                    });
                }

                // Options available for everyone (including Tecnico)
                opciones.push(
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
                        command: () => this.nuevoReporte(equipo.id)
                    }
                );

                return {
                    ...equipo,
                    opciones: opciones
                };
            });
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            this.dt2.filterGlobal(target.value, 'contains');
        }
    }

    editarEquipo(id: number) {
        this.router.navigate(['biomedica/equipos/edit/', id]);
    }

    async desactivarEquipo(equipo: any) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas desactivar el equipo ${equipo.nombres} con serie ${equipo.serie}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, desactivar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const equipoUpdate = { ...equipo, estadoBaja: true };
                    await this.equipoServices.updateEquipo(equipo.id, equipoUpdate);
                    Swal.fire(
                        'Desactivado!',
                        'El equipo ha sido desactivado.',
                        'success'
                    );
                    this.cargarEquipos();
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al desactivar el equipo.',
                        'error'
                    );
                }
            }
        });
    }

    verHojaVida(id: number) {
        this.router.navigate(['biomedica/hojavidaequipo/', id]);
    }

    verReportes(id: number) {
        this.router.navigate(['biomedica/reportesequipo/', id]);
    }

    nuevoReporte(id: number) {
        sessionStorage.setItem('TipoMantenimiento', 'C');
        this.router.navigate(['biomedica/nuevoreporte/', id]);
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
        this.calcularFechas(false); // false para no sobrescribir immediately si se abre con datos existentes, pero la UI debe reflejar la periodicidad
        // Si hay periodicidad valida, recalcular para asegurar consistencia
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

            Swal.fire(
                'Actualizado!',
                'El plan de mantenimiento ha sido actualizado.',
                'success'
            );

            this.displayPlanDialog = false;
            this.cargarEquipos(); // Recargar para mostrar cambios
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Error!',
                'Hubo un problema al actualizar el plan.',
                'error'
            );
        }
    }
}
