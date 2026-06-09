import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ManageReporteMantenimientoComponent } from '../reporte-mantenimiento/manage-reporte-mantenimiento.component';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { InspeccionService } from '../../../../Services/appServices/areasFisicas/inspeccion.service';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { AreaElementoService } from '../../../../Services/appServices/areasFisicas/area-elemento.service';
import { UserService } from '../../../../Services/appServices/userServices/user.service';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../../utilidades';

@Component({
    selector: 'app-manage-inspeccion',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, SelectModule, CalendarModule, TooltipModule, TableModule, RadioButtonModule, CheckboxModule, DialogModule, ManageReporteMantenimientoComponent, TextareaModule, MantenimientoadminnavbarComponent],
    templateUrl: './manage-inspeccion.component.html',
    styleUrls: ['./manage-inspeccion.component.css']
})
export class ManageInspeccionComponent implements OnInit {

    areaId: number | null = null;
    planMantenimientoId: number | null = null;
    mantenimientoPreventivoId: number | null = null;
    inspeccionId: number | null = null;
    nombreArea: string = '';

    inspecciones: any[] = [];

    usuarios: any[] = [];
    usuarioSeleccionado: number | null = null;

    fechaActual: Date = new Date();
    isReadonly: boolean = false;

    reporteModalVisible: boolean = false;
    selectedReporteElementId: number | null = null;
    selectedInspeccionId: number | null = null; // To link report to the created inspection (if saved first)
    fallasTextToInject: string = ''; // Text to inject into the report
    nombresElementosToInject: string = ''; // The concatenated names of elements
    inspectorNombre: string = '';
    reporteRelacionadoId: number | null = null;


    estados = [
        { label: 'Bueno', value: 1 },
        { label: 'Regular', value: 2 },
        { label: 'Malo', value: 3 }
    ];

    inspeccionService = inject(InspeccionService);
    areasService = inject(AreasService);
    areaElementoService = inject(AreaElementoService);
    userService = inject(UserService);
    reporteService = inject(ReporteMantenimientoService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    constructor() { }

    async ngOnInit() {
        // Leer parámetros de consulta
        this.route.queryParams.subscribe(async params => {
            this.areaId = params['areaId'] ? +params['areaId'] : null;
            this.planMantenimientoId = params['planMantenimientoId'] ? +params['planMantenimientoId'] : null;
            this.mantenimientoPreventivoId = params['mantenimientoPreventivoId'] ? +params['mantenimientoPreventivoId'] : null;
            this.inspeccionId = params['inspeccionId'] ? +params['inspeccionId'] : null;

            const mode = params['mode'];
            this.isReadonly = mode === 'view';

            if (this.areaId) {
                await this.loadDatosArea(this.areaId);
            } else {
                Swal.fire('Error', 'No se especificó un área para inspeccionar', 'error');
                this.cancelar();
            }
        });

        const decodedToken = getDecodedAccessToken();
        if (decodedToken && decodedToken.id) {
            this.usuarioSeleccionado = decodedToken.id;
        } else {
            if (!this.isReadonly) {
                Swal.fire('Error', 'No se pudo identificar al usuario. Inicie sesión nuevamente.', 'error');
                this.router.navigate(['/login']);
            }
        }
    }



    async loadDatosArea(areaId: number) {
        try {
            // 1. Obtener datos del área para la cabecera
            const areas = await this.areasService.getAllAreas();
            const area = areas.find((a: any) => a.id === areaId);

            if (area) {
                const serviceName = area.servicios?.nombres || area.servicios?.nombre || area.servicio?.nombre || 'SIN SERVICIO';
                this.nombreArea = `${serviceName} - ${area.nombre}`;
            }

            // 2. Cargar inspecciones existentes si tenemos Plan ID y MantenimientoPreventivo ID (Auditoría Histórica)
            let inspeccionesExistentes: any[] = [];
            if (this.planMantenimientoId && this.mantenimientoPreventivoId) {
                const allInspecciones = await this.inspeccionService.getAllInspecciones();
                inspeccionesExistentes = allInspecciones.filter((i: any) =>
                    (i.mantenimientoPreventivoId == this.mantenimientoPreventivoId) &&
                    (i.areaElemento?.areaIdFk == areaId || i.areaElemento?.areas?.id == areaId)
                );
            } else if (this.inspeccionId) {
                const allInspecciones = await this.inspeccionService.getAllInspecciones();
                const rep = allInspecciones.find(i => i.id == this.inspeccionId);
                if (rep) {
                    const repDate = new Date(rep.fecha).toDateString();
                    inspeccionesExistentes = allInspecciones.filter((i: any) =>
                        new Date(i.fecha).toDateString() === repDate &&
                        (i.areaElemento?.areaIdFk == areaId || i.areaElemento?.areas?.id == areaId) &&
                        !i.mantenimientoPreventivoId
                    );
                }
            } else if (this.planMantenimientoId) {
                const allInspecciones = await this.inspeccionService.getAllInspecciones();
                inspeccionesExistentes = allInspecciones.filter((i: any) =>
                    (i.planMantenimientoId == this.planMantenimientoId || i.planMantenimiento?.id == this.planMantenimientoId) &&
                    (i.areaElemento?.areaIdFk == areaId || i.areaElemento?.areas?.id == areaId)
                );
            }

            if (this.isReadonly) {
                // MODO VISTA: La fuente de verdad son las inspecciones ya realizadas
                if (inspeccionesExistentes.length > 0) {
                    const primerInspector = inspeccionesExistentes[0].usuario;
                    if (primerInspector) {
                        this.inspectorNombre = `${primerInspector.nombres || ''} ${primerInspector.apellidos || ''}`.trim();
                    } else if (inspeccionesExistentes[0].usuarioIdFk) {
                        this.inspectorNombre = `ID: ${inspeccionesExistentes[0].usuarioIdFk}`;
                    } else {
                        this.inspectorNombre = 'No registrado';
                    }

                    try {
                        const allReportes: any = await this.reporteService.getAllReportes();
                        const insIds = inspeccionesExistentes.map(i => i.id);
                        const foundReport = allReportes.find((r: any) => insIds.includes(r.inspeccionId) || insIds.includes(r.inspeccion?.id));
                        if (foundReport) {
                            this.reporteRelacionadoId = foundReport.id;
                            this.selectedInspeccionId = foundReport.inspeccionId || insIds[0];
                        }
                    } catch (e) {
                        console.error('No se pudo encontrar el reporte vinculado', e);
                    }
                }

                // Esto garantiza que si se quitó un elemento del área posteriormente, aún aparezca en el histórico
                // Deduplicate items to prevent issues with duplicate inspection records for the same element
                const mapaInspecciones = new Map();
                inspeccionesExistentes.forEach((i: any) => {
                    const cantidadStr = i.areaElemento?.cantidad ? ` (Cantidad: ${i.areaElemento.cantidad})` : '';
                    mapaInspecciones.set(i.areaElementoIdFk, {
                        id: i.id,
                        areaElementoIdFk: i.areaElementoIdFk,
                        elementoNombre: (i.areaElemento?.elemento?.nombre || i.areaElemento?.elementos?.nombre || i.elementoNombre || 'Elemento no disponible') + cantidadStr,
                        estado: i.estado,
                        observaciones: i.observaciones,
                        isBueno: i.estado === 1,
                        isRegular: i.estado === 2,
                        isMalo: i.estado === 3
                    });
                });
                this.inspecciones = Array.from(mapaInspecciones.values());

                // Fallback: Si no hay inspecciones, mostrar elementos actuales (por si se acaba de crear el plan)
                if (this.inspecciones.length === 0) {
                    const elementosAsignados = await this.areaElementoService.getElementosByArea(areaId);
                    this.inspecciones = elementosAsignados.map((item: any) => ({
                        id: null,
                        areaElementoIdFk: item.id,
                        elementoNombre: `${item.elemento?.nombre || 'Sin nombre'} (Cantidad: ${item.cantidad || 1})`,
                        estado: null,
                        observaciones: '',
                        isBueno: false,
                        isRegular: false,
                        isMalo: false
                    }));
                }
            } else {
                // MODO REALIZAR / EDITAR: 
                // La fuente de verdad es la UNIÓN de los elementos actualmente asignados y los que YA tienen inspección (aunque se hayan quitado)
                const elementosAsignados = await this.areaElementoService.getElementosByArea(areaId);

                // 1. Mapeamos las inspecciones de los elementos actualmente activos
                const mapaInspecciones = new Map();

                elementosAsignados.forEach((item: any) => {
                    const existente = inspeccionesExistentes.find((i: any) => i.areaElementoIdFk === item.id);
                    mapaInspecciones.set(item.id, {
                        id: existente ? existente.id : null,
                        areaElementoIdFk: item.id,
                        elementoNombre: `${item.elemento?.nombre || 'Sin nombre'} (Cantidad: ${item.cantidad || 1})`,
                        estado: existente ? existente.estado : null,
                        observaciones: existente ? existente.observaciones : '',
                        isBueno: existente ? existente.estado === 1 : false,
                        isRegular: existente ? existente.estado === 2 : false,
                        isMalo: existente ? existente.estado === 3 : false
                    });
                });

                // 2. Agregamos las inspecciones existentes de elementos que ya no están asignados activamente (inactivos/borrados)
                inspeccionesExistentes.forEach((i: any) => {
                    if (!mapaInspecciones.has(i.areaElementoIdFk)) {
                        const cantidadStr = i.areaElemento?.cantidad ? ` (Cantidad: ${i.areaElemento.cantidad})` : '';
                        mapaInspecciones.set(i.areaElementoIdFk, {
                            id: i.id,
                            areaElementoIdFk: i.areaElementoIdFk,
                            elementoNombre: (i.areaElemento?.elemento?.nombre || i.areaElemento?.elementos?.nombre || i.elementoNombre || 'Elemento no disponible') + cantidadStr,
                            estado: i.estado,
                            observaciones: i.observaciones,
                            isBueno: i.estado === 1,
                            isRegular: i.estado === 2,
                            isMalo: i.estado === 3
                        });
                    }
                });

                this.inspecciones = Array.from(mapaInspecciones.values());
            }

        } catch (error) {
            console.error('Error cargando datos del área', error);
            Swal.fire('Error', 'No se pudieron cargar los datos de la inspección', 'error');
        }
    }

    // Helpers para actualizar estado desde checkboxes/radios en la tabla
    setEstado(inspeccion: any, estado: number) {
        if (this.isReadonly) return;
        inspeccion.estado = estado;
        inspeccion.isBueno = estado === 1;
        inspeccion.isRegular = estado === 2;
        inspeccion.isMalo = estado === 3;
    }

    async guardar() {
        if (this.isReadonly) return;

        if (!this.usuarioSeleccionado) {
            Swal.fire('Atención', 'Seleccione el inspector responsable', 'warning');
            return;
        }

        // Verificar si hay al menos una inspección realizada
        const inspeccionesRealizadas = this.inspecciones.filter(i => i.estado !== null);

        if (inspeccionesRealizadas.length === 0) {
            Swal.fire('Atención', 'No ha realizado ninguna inspección en la hoja', 'warning');
            return;
        }



        try {
            // Guardar uno por uno (Idealmente sería un endpoint bulk)
            const promesas = inspeccionesRealizadas.map(i => {
                const data = {
                    areaElementoIdFk: i.areaElementoIdFk,
                    usuarioIdFk: this.usuarioSeleccionado,
                    fecha: this.fechaActual,
                    estado: i.estado,
                    observaciones: i.observaciones,
                    planMantenimientoId: this.planMantenimientoId,
                    mantenimientoPreventivoId: this.mantenimientoPreventivoId
                };
                return this.inspeccionService.createInspeccion(data);
            });

            const resultados = await Promise.all(promesas);

            // Verificar si hay fallas (estado 2 o 3)
            const elementosConFalla = inspeccionesRealizadas.filter(i => i.estado === 2 || i.estado === 3);

            if (elementosConFalla.length > 0) {
                Swal.fire({
                    title: 'Inspección guardada',
                    text: 'Se encontraron elementos en estado Regular o Malo. Es obligatorio generar el Reporte de Servicio Técnico (Daños).',
                    icon: 'warning',
                    confirmButtonText: 'Generar Reporte Consolidado',
                    allowOutsideClick: false
                }).then(() => {
                    this.abrirReporteConsolidado(elementosConFalla, resultados);
                });
            } else {
                Swal.fire('Éxito', 'Inspección guardada correctamente y sin fallos', 'success').then(() => {
                    this.cancelar(); // Navega al listado
                });
            }

        } catch (error) {
            console.error('Error guardando inspección', error);
            Swal.fire('Error', 'Ocurrió un error al guardar algunos registros', 'error');
        }
    }

    location = inject(Location);

    cancelar() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else {
            this.router.navigate(['/areas/inspecciones/listado']);
        }
    }

    verReporte() {
        if (this.reporteRelacionadoId || this.selectedInspeccionId) {
            // El dialogo internamente verificará isReadonlyReport=true 
            // e instanciará loadReporteByInspeccionId(selectedInspeccionId) si se le pasa
            this.reporteModalVisible = true;
        } else {
            Swal.fire('Información', 'No existe un reporte consolidado vinculado a esta inspección.', 'info');
        }
    }

    abrirReporteConsolidado(elementosConFalla: any[], resultadosDB: any[]) {
        // Enlazar al primer elemento de falla para el reporte global
        this.selectedReporteElementId = elementosConFalla[0].areaElementoIdFk;

        // Intentar encontrar el ID de la inspección generada en DB (si la API lo retorna)
        const inspeccionDB = resultadosDB.find(r => r && r.areaElementoIdFk === this.selectedReporteElementId);
        this.selectedInspeccionId = inspeccionDB ? inspeccionDB.id : null;

        let fallasText = "Se reportan los siguientes hallazgos consolidados:\n\n";
        let nombresElementos: string[] = [];

        elementosConFalla.forEach(item => {
            const estadoStr = item.estado === 2 ? 'REGULAR' : 'MALO';
            fallasText += `- [${estadoStr}] ${item.elementoNombre}:\n  Observaciones: ${item.observaciones || "Sin comentarios"}\n\n`;
            nombresElementos.push(item.elementoNombre);
        });

        this.fallasTextToInject = fallasText;
        this.nombresElementosToInject = nombresElementos.join(', ');
        this.reporteModalVisible = true;
    }

    abrirReporte(item: any) {
        // Ya no se usa individual, pero se deja por si acaso
        this.selectedReporteElementId = item.areaElementoIdFk;
        this.selectedInspeccionId = item.id;
        this.fallasTextToInject = `${item.observaciones || ''}`;
        this.reporteModalVisible = true;
    }

    cerrarReporte(saved: boolean) {
        this.reporteModalVisible = false;
        this.selectedReporteElementId = null;
        if (saved) {
            Swal.fire('Información', 'El reporte consolidado ha sido guardado.', 'info').then(() => {
                this.cancelar();
            });
        } else {
            this.cancelar(); // Navegamos para salir
        }
    }
}
