import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Re-compiling to fix phantom errors
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { ElementosService } from '../../../../Services/appServices/areasFisicas/elementos.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { PdfGeneratorService } from '../../../../Services/appServices/biomedicaServices/pdf-generator/pdf-generator.service';
import { InspeccionService } from '../../../../Services/appServices/areasFisicas/inspeccion.service';
import Swal from 'sweetalert2';

import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-all-reportes-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TooltipModule, TagModule, MantenimientoadminnavbarComponent, SelectModule, FormsModule, InputTextModule],
    templateUrl: './all-reportes-list.component.html',
    styleUrls: ['./all-reportes-list.component.css']
})
export class AllReportesListComponent implements OnInit {

    router = inject(Router);
    reporteService = inject(ReporteMantenimientoService);
    inspeccionService = inject(InspeccionService);
    areasService = inject(AreasService);
    elementosService = inject(ElementosService);
    servicioService = inject(ServicioService);
    pdfGeneratorService = inject(PdfGeneratorService);

    viewType: 'reportes' | 'inspecciones' = 'reportes';
    reportes: any[] = [];
    filteredReportes: any[] = [];
    inspecciones: any[] = [];
    filteredInspecciones: any[] = [];
    loading: boolean = true;
    dataLoaded: boolean = false; // Nueva bandera para evitar parpadeo
    nombreReferencia: string = ''; // Nombre del contexto actual

    // Filtros
    servicios: any[] = [];
    selectedServicio: any = null;

    allAreas: any[] = []; // Store all to filter locally
    areas: any[] = [];
    selectedArea: any = null;

    elementos: any[] = [];
    selectedElemento: any = null;

    currentFlow: 'area' | 'elemento' | 'global' = 'area';
    step: 1 | 2 | 3 = 1; // 1: Service/Element List, 2: Area List (for area flow), 3: Final Reports Table
    searchText: string = '';
    reportCounts: { areas: { [key: number]: number }, elementos: { [key: number]: number } } = { areas: {}, elementos: {} };

    // Filtros de fecha
    filtroMes: number | null = null;
    filtroAnio: number | null = null;
    meses = [
        { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 }, { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 }, { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
    ];
    anios = [
        { label: '2024', value: 2024 }, { label: '2025', value: 2025 },
        { label: '2026', value: 2026 }, { label: '2027', value: 2027 }
    ];

    route = inject(ActivatedRoute);

    ngOnInit() {
        this.dataLoaded = false;
        this.initializeComponent();
    }

    async initializeComponent() {
        await this.loadInitialData();
        await this.loadReportes();
        this.dataLoaded = true;
    }

    async loadInitialData() {
        try {
            this.servicios = await this.servicioService.getAllServicios();
            this.allAreas = await this.areasService.getAllAreas();
            this.areas = [...this.allAreas]; // Initially all areas
            this.elementos = await this.elementosService.getAllElementos();

            // Auto-seleccionar filtros si vienen por URL
            const params = this.route.snapshot.params;
            const queryParams = this.route.snapshot.queryParams;
            const areaId = queryParams['areaId'] || (this.router.url.includes('reportes-area') ? params['id'] : null);
            const elementoId = queryParams['elementoId'];
            const serviceId = queryParams['serviceId'];
            const flowParam = queryParams['flow'];

            if (flowParam) {
                this.currentFlow = flowParam as any;
            }

            const viewParam = queryParams['view'];
            if (viewParam === 'inspecciones' || viewParam === 'reportes') {
                this.viewType = viewParam;
            }

            // Primero resolvemos la selección de servicio sin cambiar el 'step'
            if (serviceId) {
                this.selectedServicio = this.servicios.find(s => s.id == serviceId);
                if (this.selectedServicio) {
                    this.areas = this.allAreas.filter((a: any) => (a.servicioIdFk === this.selectedServicio.id || a.servicioId === this.selectedServicio.id));
                    this.step = 2; // Default for service selection
                }
            }

            // Luego resolvemos la selección de área o elemento, que nos lleva al paso final (3)
            if (areaId) {
                this.selectedArea = this.allAreas.find(a => a.id == areaId);
                if (this.selectedArea) {
                    if (!this.selectedServicio) {
                        this.selectedServicio = this.servicios.find(s => s.id == this.selectedArea.servicioIdFk);
                        this.areas = this.allAreas.filter((a: any) => (a.servicioIdFk === this.selectedServicio?.id || a.servicioId === this.selectedServicio?.id));
                    }
                    this.currentFlow = 'area';
                    this.step = 3;
                }
            } else if (elementoId) {
                this.selectedElemento = this.elementos.find(e => e.id == elementoId);
                if (this.selectedElemento) {
                    this.currentFlow = 'elemento';
                    this.step = 3;
                }
            }

            this.updateReferenceName();
        } catch (error) {
            console.error('Error cargando filtros', error);
        }
    }

    updateReferenceName() {
        if (this.selectedArea) {
            this.nombreReferencia = this.selectedArea.nombre;
        } else if (this.selectedServicio) {
            this.nombreReferencia = this.selectedServicio.nombres;
        } else {
            this.nombreReferencia = 'Globales';
        }
    }

    /**
     * Carga los reportes de mantenimiento y aplica filtros iniciales
     */
    async loadReportes() {
        this.loading = true;
        try {
            if (this.viewType === 'reportes') {
                const data = await this.reporteService.getAllReportes();
                this.reportes = data.map(r => ({
                    ...r,
                    fecha: new Date(r.fecha),
                    nombre: r.areaElemento?.elemento?.nombre || r.elementoNombre || 'N/A'
                }));
                this.calculateCounts();
                this.applyFilters();
            } else {
                const data = await this.inspeccionService.getAllInspecciones();
                // Agrupar inspecciones por mantenimientoPreventivoId o por fecha/área si no tienen plan
                // El backend devuelve registros individuales por elemento. Agrupémoslos para ver "La Inspección" de la sala.
                const groupedMap = new Map();
                data.forEach(ins => {
                    const areaId = ins.areaElemento?.areas?.id || ins.areaElemento?.areaIdFk;
                    if (this.selectedArea && areaId !== this.selectedArea.id) return;

                    const dateKey = new Date(ins.fecha).toDateString();
                    const groupKey = ins.mantenimientoPreventivoId ? `P-${ins.mantenimientoPreventivoId}` : `D-${dateKey}-${areaId}`;

                    if (!groupedMap.has(groupKey)) {
                        groupedMap.set(groupKey, {
                            id: ins.id, // ID representativo
                            fecha: new Date(ins.fecha),
                            usuario: ins.usuario,
                            inspector: ins.usuario ? `${ins.usuario.nombres} ${ins.usuario.apellidos}` : 'N/A',
                            mantenimientoPreventivoId: ins.mantenimientoPreventivoId,
                            planMantenimientoId: ins.planMantenimientoId,
                            areaId: areaId,
                            areaNombre: ins.areaElemento?.areas?.nombre || 'N/A',
                            detalles: []
                        });
                    }
                    groupedMap.get(groupKey).detalles.push(ins);
                });

                this.inspecciones = Array.from(groupedMap.values()).sort((a: any, b: any) => b.fecha.getTime() - a.fecha.getTime());
                this.applyFilters();
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los registros', 'error');
        } finally {
            this.loading = false;
        }
    }

    calculateCounts() {
        this.reportCounts = { areas: {}, elementos: {} };
        this.reportes.forEach(r => {
            const areaId = r.areaElemento?.areas?.id || r.areaElemento?.areaIdFk;
            const elementoId = r.areaElemento?.elemento?.id || r.areaElemento?.elementoIdFk;

            if (areaId) {
                this.reportCounts.areas[areaId] = (this.reportCounts.areas[areaId] || 0) + 1;
            }
            if (elementoId) {
                this.reportCounts.elementos[elementoId] = (this.reportCounts.elementos[elementoId] || 0) + 1;
            }
        });
    }

    /**
     * Maneja el cambio de servicio para actualizar la lista de áreas disponibles.
     */
    onServicioChange() {
        this.selectedArea = null;
        if (this.selectedServicio) {
            this.areas = this.allAreas.filter((a: any) => (a.servicioIdFk === this.selectedServicio.id || a.servicioId === this.selectedServicio.id));
            this.step = 2; // Selection Area for Area Flow
            this.searchText = '';
        } else {
            this.areas = [...this.allAreas];
            this.step = 1;
        }
        this.applyFilters();
        this.updateReferenceName();
    }

    onAreaSelect(area: any) {
        this.selectedArea = area;
        this.viewType = 'reportes';
        this.step = 3;
        this.updateReferenceName();
        this.loadReportes(); // Reload to filter specifically if needed
    }

    onElementoSelect(elemento: any) {
        this.selectedElemento = elemento;
        this.step = 3;
        this.applyFilters();
        this.updateReferenceName();
    }

    verInspeccionesArea(area: any) {
        this.selectedArea = area;
        this.viewType = 'inspecciones';
        this.step = 3;
        this.updateReferenceName();
        this.loadReportes();
    }

    getFilteredServicios() {
        if (!this.searchText) return this.servicios;
        return this.servicios.filter(s => s.nombres.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    getFilteredAreas() {
        if (!this.searchText) return this.areas;
        return this.areas.filter(a => a.nombre.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    getFilteredElementos() {
        if (!this.searchText) return this.elementos;
        return this.elementos.filter(e => e.nombre.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    resetFiltros() {
        this.selectedServicio = null;
        this.selectedArea = null;
        this.selectedElemento = null;
        this.filtroMes = null;
        this.filtroAnio = null;
        this.step = 1;
        this.searchText = '';
        this.viewType = 'reportes';
        this.applyFilters();
        this.updateReferenceName();
    }

    /**
     * Aplica los filtros de Servicio, Área y Elemento localmente.
     */
    applyFilters() {
        if (this.viewType === 'reportes') {
            this.filteredReportes = this.reportes.filter(r => {
                const matchesSearch = !this.searchText ||
                    r.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    r.realizadoPor?.toLowerCase().includes(this.searchText.toLowerCase());

                const matchesArea = !this.selectedArea || r.areaElemento?.areas?.id === this.selectedArea.id || r.areaElemento?.areaIdFk === this.selectedArea.id;
                const matchesElemento = !this.selectedElemento || r.areaElemento?.elemento?.id === this.selectedElemento.id;

                const fecha = new Date(r.fecha);
                const matchesMes = !this.filtroMes || (fecha.getMonth() + 1) === this.filtroMes;
                const matchesAnio = !this.filtroAnio || fecha.getFullYear() === this.filtroAnio;

                return matchesSearch && matchesArea && matchesElemento && matchesMes && matchesAnio;
            });
        } else {
            this.filteredInspecciones = this.inspecciones.filter(ins => {
                const fecha = new Date(ins.fecha);
                const matchesMes = !this.filtroMes || (fecha.getMonth() + 1) === this.filtroMes;
                const matchesAnio = !this.filtroAnio || fecha.getFullYear() === this.filtroAnio;
                const matchesArea = !this.selectedArea || ins.areaId === this.selectedArea.id;

                return matchesMes && matchesAnio && matchesArea;
            });
        }
        this.updateReferenceName();
    }

    async verReporte(id: number) {
        try {
            this.loading = true;
            const reporteCompleto = await this.reporteService.getReporteById(id);
            if (reporteCompleto) {
                await this.pdfGeneratorService.generateReporteIndustrialCorrectivo(reporteCompleto, true);
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        } finally {
            this.loading = false;
        }
    }

    verDetalleInspeccion(ins: any) {
        const areaId = ins.areaId;
        const planId = ins.planMantenimientoId;
        const mpId = ins.mantenimientoPreventivoId;
        
        let baseUrl = this.router.url.split('?')[0];
        let returnUrl = `${baseUrl}?flow=${this.currentFlow}&view=${this.viewType}`;
        if (this.selectedServicio) returnUrl += `&serviceId=${this.selectedServicio.id}`;
        if (this.selectedArea) returnUrl += `&areaId=${this.selectedArea.id}`;
        
        this.router.navigate(['/areas/inspecciones/crear'], {
            queryParams: { 
                areaId: areaId, 
                planMantenimientoId: planId, 
                mantenimientoPreventivoId: mpId, 
                inspeccionId: ins.id,
                mode: 'view',
                returnUrl: returnUrl
            }
        });
    }

    getSeverity(type: string): string {
        switch (type) {
            case 'Preventivo': return 'success';
            case 'Correctivo': return 'warning';
            default: return 'info';
        }
    }

    backToDashboard() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
            return;
        }

        // Si estamos en el flujo general de reportes (Wizard), navegar entre pasos
        if (this.router.url.includes('reportes-general')) {
            if (this.step === 3) {
                this.step = 2;
                this.selectedArea = null;
                this.selectedElemento = null;
                this.applyFilters();
                return;
            }
            if (this.step === 2) {
                this.step = 1;
                this.selectedServicio = null;
                this.applyFilters();
                return;
            }
        }

        // Lógica para accesos directos (cuando vienes desde el detalle de un área específica)
        if (this.selectedArea) {
            const servicioId = this.selectedArea.servicioIdFk || this.selectedArea.servicioId;
            if (servicioId) {
                this.router.navigate(['/adminmantenimiento/areas-por-servicio', servicioId]);
                return;
            }
        }

        if (this.selectedServicio) {
            this.router.navigate(['/adminmantenimiento/areas-por-servicio', this.selectedServicio.id]);
            return;
        }

        this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }
}
