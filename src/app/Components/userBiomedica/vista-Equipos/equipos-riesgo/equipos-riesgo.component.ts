import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { Router, RouterModule } from '@angular/router';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MetrologiaService } from '../../../../Services/appServices/biomedicaServices/metrologia/metrologia.service';
import { TrasladosService } from '../../../../Services/appServices/biomedicaServices/traslados/traslados.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { getDecodedAccessToken } from '../../../../utilidades';
import { HistorialEquiposComponent } from '../historial-equipos/historial-equipos.component';
import Swal from 'sweetalert2';
import { ReporteBajaModalComponent } from '../reporte-baja-modal/reporte-baja-modal.component';

import { UppercaseDirective } from '../../../../Directives/uppercase.directive';

@Component({
    selector: 'app-equipos-riesgo',
    standalone: true,
    imports: [TableModule, RouterModule, CommonModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule,
        SplitButtonModule, DialogModule, MultiSelectModule, SelectModule, InputNumberModule, DatePickerModule, FormsModule, TagModule, UppercaseDirective, CheckboxModule],
    providers: [DialogService],
    templateUrl: './equipos-riesgo.component.html',
    styleUrl: './equipos-riesgo.component.css'
})
export class EquiposRiesgoComponent implements OnInit {

    @ViewChild('dt1') dt1!: Table;
    equipos: any[] = [];
    loading: boolean = true;
    riesgoSelected: string = '';
    equiposService = inject(EquiposService);
    router = inject(Router);
    metrologiaService = inject(MetrologiaService);
    trasladosService = inject(TrasladosService);
    servicioServices = inject(ServicioService);
    messageService = inject(MessageService);
    dialogService = inject(DialogService);

    ref: DynamicDialogRef | undefined;

    // Variables para el modal de edición de plan mantenimiento
    displayPlanDialog: boolean = false;
    currentEquipo: any = null;
    selectedMonths: any[] = [];
    selectedPlans: any[] = []; // Array of objects { mes, ano }
    periodicidad: number = 0; // Legacy field
    intervencionesAnuales: number = 1;
    mesInicio: number = 1;
    anioInicio: number = new Date().getFullYear();
    calculatedMonthsText: string = '';
    libreMantenimiento: boolean = false;

    intervencionOptions = [
        { name: '1 vez al año (Anual)', value: 1 },
        { name: '2 veces al año (Semestral)', value: 2 },
        { name: '3 veces al año (Cuatrimestral)', value: 3 },
        { name: '4 veces al año (Trimestral)', value: 4 }
    ];

    anioOptions = Array.from({ length: 11 }, (_, i) => ({ name: (new Date().getFullYear() + i).toString(), value: new Date().getFullYear() + i }));

    // Variables para Traslados
    displayTrasladoDialog: boolean = false;
    displayHistorialTrasladosDialog: boolean = false;
    historialUnificado: any[] = [];
    selectedEquipoTraslado: any = null;
    servicioDestinoId: number | null = null;
    ubicacionDestino: string = '';
    ubicacionEspecificaDestino: string = '';
    nombreReceptor: string = '';
    cargoReceptor: string = '';
    entregadoPor: string = '';
    cedulaEntrega: string = '';
    cargoEntrega: string = '';
    cedulaRecibe: string = '';
    observacionesTransferencia: string = '';
    serviciosList: any[] = [];

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

    async ngOnInit() {
        if (typeof localStorage === 'undefined') return;
        this.riesgoSelected = localStorage.getItem("riesgoSelected") || '';
        if (this.riesgoSelected) {
            await this.cargarEquipos();
        } else {
            this.loading = false;
        }

        if (['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)) {
            this.serviciosList = await this.servicioServices.getAllServicios();
        }
    }

    async cargarEquipos() {
        this.loading = true;
        try {
            const data = await this.equiposService.getAllEquiposRiesgo(this.riesgoSelected);
            this.equipos = this.mapEquipos(data);
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    mapEquipos(datos: any[]): any[] {
        return datos.map((equipo: any) => ({
            ...equipo,
            opcionesHV: [
                {
                    label: 'Editar',
                    icon: 'pi pi-pencil',
                    command: () => this.editarEquipo(equipo.id),
                    visible: ['BIOMEDICAADMIN', 'SUPERADMIN', 'BIOMEDICAUSER'].includes(getDecodedAccessToken().rol)
                },
                {
                    label: 'Editar Plan Mantenimiento',
                    icon: 'pi pi-calendar',
                    command: () => this.openPlanDialog(equipo),
                    visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
                },
                {
                    label: 'Editar Plan Metrología',
                    icon: 'pi pi-cog',
                    command: () => this.openPlanMetrologiaDialog(equipo),
                    visible: ['BIOMEDICAADMIN', 'SUPERADMIN'].includes(getDecodedAccessToken().rol) && equipo.tipoEquipos?.requiereMetrologia
                },
                {
                    label: 'Registrar Actividad Metrológica',
                    icon: 'pi pi-file-excel',
                    command: () => this.viewModalMetrologia(equipo),
                    visible: ['BIOMEDICAADMIN', 'SUPERADMIN', 'BIOMEDICAUSER'].includes(getDecodedAccessToken().rol)
                },
                {
                    label: 'Dar de Baja',
                    icon: 'pi pi-trash',
                    command: () => this.darDeBaja(equipo),
                    visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
                },
                {
                    label: 'Registrar Traslado',
                    icon: 'pi pi-send',
                    command: () => this.abrirModalTraslado(equipo),
                    visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN', 'BIOMEDICATECNICO'].includes(getDecodedAccessToken().rol)
                },
                {
                    label: 'Historial Movimientos',
                    icon: 'pi pi-history',
                    command: () => this.verHistorialTraslados(equipo),
                    visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN'].includes(getDecodedAccessToken().rol)
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
                    visible: ['BIOMEDICAADMIN', 'BIOMEDICAUSER', 'SUPERADMIN', 'BIOMEDICATECNICO'].includes(getDecodedAccessToken().rol)
                }
            ]

        }));
    }

    onGlobalFilter(event: Event) {
        const target = event.target as HTMLInputElement;
        this.dt1.filterGlobal(target.value, 'contains');
    }

    verHojaVida(id: number) {
        this.router.navigate(['biomedica/hojavidaequipo', id]);
    }

    verReportes(id: number) {
        this.router.navigate(['biomedica/reportesequipo/', id]);
    }

    editarEquipo(id: number) {
        this.router.navigate(['biomedica/adminequipos/edit/', id]);
    }

    nuevoReporte(id: number) {
        if (typeof localStorage !== 'undefined') localStorage.setItem('TipoMantenimiento', 'C');
        this.router.navigate(['biomedica/nuevoreporte/', id]);
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
            return 'No Aplica';
        }
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const uniqueMeses = [...new Set(planes.map(p => p.mes))].sort((a: any, b: any) => a - b);
        return uniqueMeses.map((m: any) => meses[m - 1]).join(', ');
    }

    obtenerMesesConCumplimiento(equipo: any): any[] {
        const planes = equipo.planesMantenimiento || [];
        const reportes = equipo.reporte || [];
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const meses = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];

        return planes.map((p: any) => {
            const m = Number(typeof p === 'object' ? p.mes : p);
            let y = currentYear;
        if (typeof p === 'object') {
          const rawYear = p.ano || p.año || p.anio || p.year;
          if (rawYear) {
            y = Number(rawYear);
            if (y < 100) y += 2000;
          }
        }

            // Buscar reporte preventivo que coincida con mes y año programado
            // Buscar reporte preventivo que coincida con mes y año programado
            const reportePreventivo = reportes.find((r: any) => {
                if (r.tipoMantenimiento !== 'Preventivo') return false;

                const rMes = Number(r.mesProgramado);
                if (rMes !== m) return false;

                // Emparejamiento por año estricto
                const rAnio = r.añoProgramado || r.anioProgramado;
                if (rAnio) {
                    return Number(rAnio) === y;
                }

                if (r.fechaRealizado) {
                    // Extraer año de fechaRealizado (formato YYYY-MM-DD o similar)
                    const yearFromFecha = typeof r.fechaRealizado === 'string'
                        ? Number(r.fechaRealizado.split('-')[0])
                        : new Date(r.fechaRealizado).getFullYear();
                    return yearFromFecha === y;
                }

                return false; // Si no hay información de año, no se asume coincidencia
            });

            const realizado = !!(reportePreventivo && reportePreventivo.realizado !== false);

            let color = '';

            if (y < currentYear || (y === currentYear && m < currentMonth)) {
                // PASADO: Verde si se realizó, Rojo si no
                color = realizado ? '#2ecc71' : '#e74c3c';
            } else if (y === currentYear && m === currentMonth) {
                // ACTUAL: Verde si ya se realizó, Amarillo si está pendiente
                color = realizado ? '#2ecc71' : '#f1c40f';
            } else {
                // FUTURO: Siempre Azul (según regla literal del usuario)
                color = '#3498db';
            }

            const mesNombre = meses[m - 1];
            const mostrarAnio = y !== currentYear;

            return {
                mes: mostrarAnio ? `${mesNombre} ${y}` : mesNombre,
                color: color
            };
        });
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

    // --- PLAN DE MANTENIMIENTO ---
    openPlanDialog(equipo: any) {
        this.currentEquipo = equipo;
        this.displayPlanDialog = true;
        this.libreMantenimiento = equipo.periodicidadM === 0;

        // Inicializar valores basados en el primer plan si existe
        if (equipo.planesMantenimiento && equipo.planesMantenimiento.length > 0) {
            const firstPlan = equipo.planesMantenimiento[0];
            this.mesInicio = firstPlan.mes || 1;
            this.anioInicio = firstPlan.ano || new Date().getFullYear();
            this.intervencionesAnuales = equipo.periodicidadM || 1;
            this.selectedPlans = equipo.planesMantenimiento;
        } else {
            this.mesInicio = new Date().getMonth() + 1;
            this.anioInicio = new Date().getFullYear();
            this.intervencionesAnuales = 1;
            this.selectedPlans = [];
        }

        this.calcularFechas();
    }

    calcularFechas() {
        if (!this.intervencionesAnuales || this.intervencionesAnuales <= 0) {
            this.calculatedMonthsText = 'Intervenciones no válidas';
            return;
        }

        const interval = 12 / this.intervencionesAnuales;
        const nuevosPlanes = [];
        let m = this.mesInicio;
        let y = this.anioInicio;

        for (let i = 0; i < this.intervencionesAnuales; i++) {
            let calcMonth = m + (i * interval);
            let calcYear = y + Math.floor((calcMonth - 1) / 12);
            calcMonth = ((calcMonth - 1) % 12) + 1;

            nuevosPlanes.push({ mes: Math.floor(calcMonth), ano: calcYear });
        }

        this.selectedPlans = nuevosPlanes;
        this.updateCalculatedText();
    }

    updateCalculatedText() {
        if (!this.selectedPlans || this.selectedPlans.length === 0) {
            this.calculatedMonthsText = 'Sin fechas seleccionadas';
            return;
        }

        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const textPlanes = this.selectedPlans.map(p => `${meses[p.mes - 1]} ${p.ano}`).join(', ');
        this.calculatedMonthsText = `Ciclo calculado: ${textPlanes}`;
    }

    async savePlan() {
        if (!this.currentEquipo) return;

        try {
            let finalPlans = this.selectedPlans;
            if (this.libreMantenimiento) {
                finalPlans = [];
                this.intervencionesAnuales = 0;
            }

            const equipoUpdate = {
                ...this.currentEquipo,
                periodicidadM: this.intervencionesAnuales,
                planesMantenimiento: finalPlans
            };

            await this.equiposService.updateEquipo(this.currentEquipo.id, equipoUpdate);
            Swal.fire('Actualizado!', 'El plan de mantenimiento ha sido actualizado.', 'success');
            this.displayPlanDialog = false;
            this.cargarEquipos();
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', 'Hubo un problema al actualizar el plan.', 'error');
        }
    }

    // --- VARIABLES PARA METROLOGIA ---
    displayPlanMetrologiaDialog: boolean = false;
    libreActividadesMetrologicas: boolean = false;
    intervencionesAnualesMetrologia: number = 1;
    mesInicioMetrologia: number = 1;
    anioInicioMetrologia: number = new Date().getFullYear();
    selectedPlansMetrologia: any[] = [];
    calculatedMonthsTextMetrologia: string = '';
    tipoActividadGlobal: string = 'Calibración';

    tipoActividadOptions: any[] = [
        { label: 'Calibración', value: 'Calibración' },
        { label: 'Calificación', value: 'Calificación' },
        { label: 'Mantenimiento Correctivo', value: 'Mantenimiento Correctivo' },
        { label: 'Inspección', value: 'Inspección' }
    ];

    openPlanMetrologiaDialog(equipo: any) {
        this.currentEquipo = equipo;
        this.displayPlanMetrologiaDialog = true;
        this.libreActividadesMetrologicas = equipo.periodicidadC === 0;

        if (equipo.planesActividadMetrologica && equipo.planesActividadMetrologica.length > 0) {
            const firstPlan = equipo.planesActividadMetrologica[0];
            this.mesInicioMetrologia = firstPlan.mes || 1;
            this.anioInicioMetrologia = firstPlan.ano || new Date().getFullYear();
            this.intervencionesAnualesMetrologia = equipo.periodicidadC || 1;
            this.tipoActividadGlobal = firstPlan.tipoActividad || 'Calibración';
            this.selectedPlansMetrologia = equipo.planesActividadMetrologica;
        } else {
            this.mesInicioMetrologia = new Date().getMonth() + 1;
            this.anioInicioMetrologia = new Date().getFullYear();
            this.intervencionesAnualesMetrologia = 1;
            this.tipoActividadGlobal = 'Calibración';
            this.selectedPlansMetrologia = [];
        }

        this.calcularFechasMetrologia();
    }

    calcularFechasMetrologia() {
        if (this.libreActividadesMetrologicas) {
            this.selectedPlansMetrologia = [];
            this.updateCalculatedTextMetrologia();
            return;
        }

        if (this.intervencionesAnualesMetrologia <= 0) {
            this.selectedPlansMetrologia = [];
            this.updateCalculatedTextMetrologia();
            return;
        }

        const interval = 12 / this.intervencionesAnualesMetrologia;
        const nuevosPlanes = [];
        let m = this.mesInicioMetrologia;
        let y = this.anioInicioMetrologia;

        for (let i = 0; i < this.intervencionesAnualesMetrologia; i++) {
            let calcMonth = m + (i * interval);
            let calcYear = y + Math.floor((calcMonth - 1) / 12);
            calcMonth = ((calcMonth - 1) % 12) + 1;

            nuevosPlanes.push({ mes: Math.floor(calcMonth), ano: calcYear });
        }

        this.selectedPlansMetrologia = nuevosPlanes;
        this.updateCalculatedTextMetrologia();
    }

    updateCalculatedTextMetrologia() {
        if (!this.selectedPlansMetrologia || this.selectedPlansMetrologia.length === 0) {
            this.calculatedMonthsTextMetrologia = 'Sin fechas seleccionadas';
            return;
        }
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const textPlanes = this.selectedPlansMetrologia.map(p => {
            return `${meses[p.mes - 1]} ${p.ano}`;
        }).join(', ');

        this.calculatedMonthsTextMetrologia = `Ciclo calculado: ${textPlanes}`;
    }

    async savePlanMetrologia() {
        if (!this.currentEquipo) return;

        try {
            let finalPlans = this.selectedPlansMetrologia;
            if (this.libreActividadesMetrologicas) {
                finalPlans = [];
                this.intervencionesAnualesMetrologia = 0;
            }

            // Añadimos el tipo de actividad global a cada plan generado
            const planesActividadMetrologica = finalPlans.map(p => ({
                mes: p.mes,
                ano: p.ano,
                tipoActividad: this.tipoActividadGlobal
            }));

            const equipoUpdate = {
                ...this.currentEquipo,
                periodicidadC: this.intervencionesAnualesMetrologia,
                planesActividadMetrologica: planesActividadMetrologica
            };

            await this.equiposService.updateEquipo(this.currentEquipo.id, equipoUpdate);

            Swal.fire(
                'Actualizado!',
                'El plan metrológico ha sido actualizado.',
                'success'
            );

            this.displayPlanMetrologiaDialog = false;
            this.cargarEquipos(); // Reload
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Error!',
                'Hubo un problema al actualizar el plan metrológico.',
                'error'
            );
        }
    }

    // --- VARIABLES PARA REGISTRO DE METROLOGIA (DESDE LISTA) ---
    modalAddActividadMetrologica: boolean = false;
    tipoActividad: string = '';
    empresa: string = '';
    fechaRealizadoActividad: Date | undefined;
    resultado: string = '';
    errorMaximoIdentificado: number | null = null;
    observaciones: string = '';
    selectedFile: File | null = null;
    selectedFileConfirmacion: File | null = null;
    unidadMedicion: string = '';

    opcionesResultado: any[] = [
        { label: 'Cumple', value: 'Cumple' },
        { label: 'No Cumple', value: 'No Cumple' },
        { label: 'No Aplica', value: 'No Aplica' }
    ];

    opcionesTipoActividad: any[] = [
        { label: 'Calibración', value: 'Calibración' },
        { label: 'Calificación', value: 'Calificación' },
        { label: 'Validación', value: 'Validación' }
    ];

    viewModalMetrologia(equipo: any) {
        this.currentEquipo = equipo;
        this.modalAddActividadMetrologica = true;
        this.tipoActividad = '';
        this.empresa = '';
        this.fechaRealizadoActividad = undefined;
        this.resultado = '';
        this.errorMaximoIdentificado = null;
        this.observaciones = '';
        this.observaciones = '';
        this.selectedFile = null;
        this.selectedFileConfirmacion = null;
        this.unidadMedicion = '';
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    onFileSelectedConfirmacion(event: any) {
        this.selectedFileConfirmacion = event.target.files[0];
    }

    async registrarMetrologia() {
        if (!this.currentEquipo) return;
        if (!this.tipoActividad || !this.empresa || !this.fechaRealizadoActividad || !this.resultado || this.errorMaximoIdentificado === null) {
            Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('equipoIdFk', this.currentEquipo.id.toString());
        formData.append('tipoActividad', this.tipoActividad);
        formData.append('empresa', this.empresa);
        formData.append('fechaRealizado', this.fechaRealizadoActividad.toISOString());
        formData.append('resultado', this.resultado);
        formData.append('errorMaximoIdentificado', this.errorMaximoIdentificado.toString());
        formData.append('unidadMedicion', this.unidadMedicion);
        formData.append('observaciones', this.observaciones);
        formData.append('usuarioIdFk', getDecodedAccessToken().id);
        if (this.selectedFile) {
            formData.append('rutaReporte', this.selectedFile);
        }

        if (this.selectedFileConfirmacion) {
            formData.append('confirmacionMetrologica', this.selectedFileConfirmacion);
        }

        try {
            await this.metrologiaService.registrarActividadConArchivo(formData);
            Swal.fire('Éxito', 'Actividad metrológica registrada correctamente.', 'success');
            this.modalAddActividadMetrologica = false;
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', 'No se pudo registrar la actividad.', 'error');
        }
    }

    // --- TRASLADOS ---
    abrirModalTraslado(equipo: any) {
        this.selectedEquipoTraslado = equipo;
        this.displayTrasladoDialog = true;
        // Resetear formulario
        this.servicioDestinoId = null;
        this.ubicacionDestino = '';
        this.ubicacionEspecificaDestino = '';
        this.nombreReceptor = '';
        this.cargoReceptor = '';
        this.entregadoPor = '';
        this.cedulaEntrega = '';
        this.cargoEntrega = '';
        this.cedulaRecibe = '';
        this.observacionesTransferencia = '';
    }

    async verHistorialTraslados(equipo: any) {
        this.selectedEquipoTraslado = equipo;
        this.loading = true;
        try {
            this.historialUnificado = await this.trasladosService.getHistorialCompleto(equipo.id);
            this.displayHistorialTrasladosDialog = true;
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el historial.' });
        } finally {
            this.loading = false;
        }
    }

    async confirmarTraslado() {
        if (!this.selectedEquipoTraslado || !this.servicioDestinoId || !this.nombreReceptor || !this.cargoReceptor || !this.entregadoPor || !this.cedulaEntrega || !this.cargoEntrega || !this.cedulaRecibe) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos.' });
            return;
        }

        try {
            const data = {
                equipoId: this.selectedEquipoTraslado.id,
                servicioDestinoId: this.servicioDestinoId!,
                ubicacionDestino: this.ubicacionDestino,
                ubicacionEspecificaDestino: this.ubicacionEspecificaDestino,
                nombreReceptor: this.nombreReceptor,
                cargoReceptor: this.cargoReceptor,
                entregadoPor: this.entregadoPor,
                cedulaEntrega: this.cedulaEntrega,
                cargoEntrega: this.cargoEntrega,
                cedulaRecibe: this.cedulaRecibe,
                observaciones: this.observacionesTransferencia,
                usuarioId: getDecodedAccessToken().id
            };

            await this.trasladosService.registrarTraslado(data);

            this.displayTrasladoDialog = false;
            this.cargarEquipos();

            Swal.fire(
                '¡Traslado Exitoso!',
                'El equipo ha sido trasladado correctamente.',
                'success'
            );

        } catch (error) {
            Swal.fire(
                'Error',
                'No se pudo registrar el traslado.',
                'error'
            );
        }
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    darDeBaja(equipo: any) {
        this.ref = this.dialogService.open(ReporteBajaModalComponent, {
            header: `Reporte de Baja - ${equipo.nombres} (${equipo.serie})`,
            width: '50vw',
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            data: { equipoId: equipo.id }
        });

        this.ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit(); // Recargar la lista
            }
        });
    }
}
