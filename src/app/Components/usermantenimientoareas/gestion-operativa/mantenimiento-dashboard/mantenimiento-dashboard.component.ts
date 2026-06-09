import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute } from '@angular/router';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { InspeccionService } from '../../../../Services/appServices/areasFisicas/inspeccion.service';
import { ObservacionesService } from '../../../../Services/appServices/areasFisicas/observaciones.service';
import { getDecodedAccessToken } from '../../../../utilidades';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-mantenimiento-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, CalendarModule, SelectModule, IconFieldModule, InputIconModule, InputTextModule, MantenimientoadminnavbarComponent],
    templateUrl: './mantenimiento-dashboard.component.html',
    styleUrl: './mantenimiento-dashboard.component.css'
})
export class MantenimientoDashboardComponent implements OnInit {
    private router = inject(Router);
    private planService = inject(PlanMantenimientoService);
    private inspeccionService = inject(InspeccionService);
    private observacionesService = inject(ObservacionesService);

    private route = inject(ActivatedRoute);

    userRole: string = '';
    myId: number | null = null;

    anio: number = new Date().getFullYear();
    mesInicio: number = new Date().getMonth() + 1;
    mesFin: number = new Date().getMonth() + 1;
    meses: any[] = [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 }
    ];
    loading: boolean = false;

    preventivos: any[] = [];
    correctivos: any[] = [];

    panelPreventivos: boolean = true;
    panelCorrectivos: boolean = false;
    panelMetas: boolean = false;
    panelMisTareas: boolean = false;

    panelRealizados: boolean = true;
    panelPendientes: boolean = false;

    panelObsPendientes: boolean = true;
    panelObsCompletadas: boolean = false;

    observaciones: any[] = [];

    constructor() { }

    async ngOnInit() {
        const tokenData = getDecodedAccessToken();
        if (tokenData) {
            this.userRole = tokenData.rol;
            this.myId = tokenData.id || tokenData.usuarioId || tokenData.uid;
        }
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        try {
            let todosMantenimientos: any[] = [];

            if (['TECNICOMANTENIMIENTO', 'USERMANTENIMIENTO'].includes(this.userRole) && this.myId) {
                // Si es técnico, solo cargamos sus mantenimientos asignados
                const res = await this.planService.getMantenimientosByTecnico(this.myId);
                const data = Array.isArray(res) ? res : (res.data || []);
                
                todosMantenimientos = data.map((m: any) => ({
                    ...m.plan, // El plan padre tiene actividad, diaRangoInicio, etc.
                    mantenimientoId: m.id,
                    mes: m.mes,
                    anio: m.anio,
                    estado: m.estado,
                    area: m.area
                }));
            } else {
                // Si es admin, cargamos todo (comportamiento original)
                const allPlanes: any = await this.planService.getAllPlanes();
                let planes: any[] = [];
                if (Array.isArray(allPlanes)) planes = allPlanes;
                else if (allPlanes && allPlanes.data) planes = allPlanes.data;

                planes.forEach((plan: any) => {
                    if (plan.mantenimientosPreventivos) {
                        plan.mantenimientosPreventivos.forEach((m: any) => {
                            todosMantenimientos.push({
                                ...plan,
                                mantenimientoId: m.id,
                                mes: m.mes,
                                estado: m.estado
                            });
                        });
                    }
                });
            }

            this.preventivos = todosMantenimientos.filter((p: any) => 
                p.mes >= this.mesInicio && 
                p.mes <= this.mesFin && 
                p.anio === this.anio && 
                Number(p.estado) !== 4
            );

            // 2. Fetch Correctivos (Inspecciones)
            let allInspecciones: any;
            if (['TECNICOMANTENIMIENTO', 'USERMANTENIMIENTO'].includes(this.userRole) && this.myId) {
                allInspecciones = await this.inspeccionService.getInspeccionesByTecnico(this.myId);
            } else {
                allInspecciones = await this.inspeccionService.getAllInspecciones();
            }
            
            let inspecs: any[] = [];
            if (Array.isArray(allInspecciones)) inspecs = allInspecciones;
            else if (allInspecciones && allInspecciones.data) inspecs = allInspecciones.data;

            this.correctivos = inspecs.filter((i: any) => {
                const d = new Date(i.fecha || i.fechaRealizacion);
                const m = d.getMonth() + 1;
                return m >= this.mesInicio && m <= this.mesFin && d.getFullYear() === this.anio;
            });

            if (['TECNICOMANTENIMIENTO', 'USERMANTENIMIENTO'].includes(this.userRole) && this.myId) {
                const resObs: any = await this.observacionesService.getObservacionesByTecnico(this.myId);
                this.observaciones = Array.isArray(resObs) ? resObs : (resObs?.data || []);
            } else {
                const resObs: any = await this.observacionesService.getAllObservaciones();
                this.observaciones = Array.isArray(resObs) ? resObs : (resObs?.data || []);
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            this.loading = false;
        }
    }

    async setDate() {
        await this.loadData();
    }

    viewPreventivos() {
        this.panelPreventivos = true;
        this.panelCorrectivos = false;
        this.panelMetas = false;
        this.panelMisTareas = false;
    }

    viewCorrectivos() {
        this.panelPreventivos = false;
        this.panelCorrectivos = true;
        this.panelMetas = false;
        this.panelMisTareas = false;
    }

    viewMetas() {
        this.panelPreventivos = false;
        this.panelCorrectivos = false;
        this.panelMetas = true;
        this.panelMisTareas = false;
    }

    viewMisTareas() {
        this.panelPreventivos = false;
        this.panelCorrectivos = false;
        this.panelMetas = false;
        this.panelMisTareas = true;
    }

    panelRealizadosView() {
        this.panelRealizados = true;
        this.panelPendientes = false;
    }

    panelPendientesView() {
        this.panelRealizados = false;
        this.panelPendientes = true;
    }

    panelObsPendientesView() {
        this.panelObsPendientes = true;
        this.panelObsCompletadas = false;
    }

    panelObsCompletadasView() {
        this.panelObsPendientes = false;
        this.panelObsCompletadas = true;
    }

    backToDashboard() {
        this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }

    obtenerNombreMes(numeroMes: number): string {
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return meses[numeroMes - 1] || '';
    }

    // Helper for status classes
    getEstadoLabel(estado: number) {
        switch (estado) {
            case 0: return 'Pendiente'; // Display as Pendiente (will be red by CSS)
            case 1: return 'Pendiente';
            case 2: return 'En Proceso';
            case 3: return 'Completado';
            default: return 'Desconocido';
        }
    }

    // Helper getters for Metas panel
    get preventivosRealizados() {
        return this.preventivos.filter(p => p.estado === 3);
    }

    get preventivosPendientes() {
        return this.preventivos.filter(p => p.estado === 1 || p.estado === 0);
    }

    get observacionesPendientes() {
        return this.observaciones.filter(o => !o.completado);
    }

    get observacionesRealizadas() {
        return this.observaciones.filter(o => o.completado);
    }

    async completarObservacion(obs: any) {
        try {
            await this.observacionesService.updateObservacion(obs.id, { completado: true });
            Swal.fire('Éxito', 'Tarea marcada como completada.', 'success');
            await this.loadData();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo completar la tarea.', 'error');
        }
    }

    // Logic for Execution Window
    canRealizarInspeccion(plan: any): boolean {

        // If plan is completed, false
        if (plan.estado === 3) return false;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        const pAnio = Number(plan.anio);
        const pMes = Number(plan.mes);
        const pDiaInicio = Number(plan.diaRangoInicio);

        // Check if plan is in the FUTURE
        // If year is greater -> Future
        if (pAnio > currentYear) return false;

        // If same year and month is greater -> Future
        if (pAnio === currentYear && pMes > currentMonth) return false;

        // If same year, same month, and Start Day hasn't arrived -> Future
        if (pAnio === currentYear && pMes === currentMonth && pDiaInicio > currentDay) {
            return false;
        }

        // Otherwise (Past or Present) -> True
        return true;
    }

    getBadgeClass(plan: any): string {
        if (plan.estado === 3) {
            return 'bg-success'; // Completado -> Verde
        }
        if (plan.estado === 2) {
            return 'bg-warning text-dark'; // En Proceso -> Amarillo
        }

        // Si el estado es Pendiente (0 ó 1)
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        const planAnio = Number(plan.anio || this.anio);
        const planMes = Number(plan.mes);

        // Si aún no llega el mes en el que toca el mantenimiento (mes futuro)
        if (planAnio > currentYear || (planAnio === currentYear && planMes > currentMonth)) {
            return 'bg-warning text-dark'; // Pendiente en mes futuro -> Amarillo
        }

        // Si ya pasó de tiempo o es del mes actual en el que estamos
        return 'bg-danger'; // Vencido o del mes actual -> Rojo
    }

    // Helper for badge class
    getStatusClass(plan: any): string {
        if (plan.estado === 3) return 'status-3'; // Completed
        if (plan.estado === 2) return 'status-2'; // In Progress
        if (plan.estado === 0) return 'status-0'; // Cancelled/Red

        // If Pending (1), check if overdue
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // Plan is from past year OR (same year and past month) -> Overdue
        if (plan.anio < currentYear || (plan.anio === currentYear && plan.mes < currentMonth)) {
            return 'status-0'; // Red
        }

        // Plan is current month, check if day passed
        if (plan.anio === currentYear && plan.mes === currentMonth) {
            if (currentDay > plan.diaRangoFin) {
                return 'status-0'; // Red
            }
        }

        // Future or current valid -> Yellow
        return 'status-1';
    }

    isFueraDeRango(plan: any): boolean {
        // Only show message if it's NOT completed AND cannot be executed (which now implies Future)
        if (plan.estado === 3) return false;
        return !this.canRealizarInspeccion(plan);
    }

    realizarInspeccion(plan: any) {
        const areaId = plan.area?.id || plan.areaIdFk;
        if (!areaId) {
            Swal.fire('Error', 'No se encontró la información del área para este mantenimiento.', 'error');
            return;
        }
        // Navigate to the inspection sheet (ManageInspeccionComponent)
        // Pass 'planMantenimientoId' as expected by the component
        this.router.navigate(['/areas/inspecciones/crear'], {
            queryParams: {
                // Here we might need both the plan ID and the monthly maintenance ID in the future,
                // but for backwards compatibility with the UI, we pass the original plan ID,
                // or if the backend inspection expects the monthly ID, we should pass that.
                // Assuming it expects `planMantenimientoId`:
                planMantenimientoId: plan.id, // Original plan ID
                mantenimientoPreventivoId: plan.mantenimientoId, // Specific monthly record
                areaId: areaId,
                returnUrl: '/adminmantenimiento/gestion-operativa/mantenimiento'
            }
        });
    }

    verDetalleInspeccion(plan: any) {
        const areaId = plan.area?.id || plan.areaIdFk;
        if (!areaId) {
            Swal.fire('Error', 'No se encontró la información del área.', 'error');
            return;
        }

        // Reuse the same component in 'view' mode (read-only)
        this.router.navigate(['/areas/inspecciones/crear'], {
            queryParams: {
                planMantenimientoId: plan.id,
                mantenimientoPreventivoId: plan.mantenimientoId,
                areaId: areaId,
                mode: 'view',
                returnUrl: '/adminmantenimiento/gestion-operativa/mantenimiento'
            }
        });
    }
}
