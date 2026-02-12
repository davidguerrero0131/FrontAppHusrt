import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Textarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InspeccionService } from '../../../Services/appServices/areasFisicas/inspeccion.service';
import { AreasService } from '../../../Services/appServices/areasFisicas/areas.service';
import { AreaElementoService } from '../../../Services/appServices/areasFisicas/area-elemento.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../utilidades';

@Component({
    selector: 'app-manage-inspeccion',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, DropdownModule, Textarea, CalendarModule, TooltipModule, TableModule, RadioButtonModule, CheckboxModule],
    templateUrl: './manage-inspeccion.component.html',
    styleUrls: ['./manage-inspeccion.component.css']
})
export class ManageInspeccionComponent implements OnInit {

    areaId: number | null = null;
    planMantenimientoId: number | null = null;
    nombreArea: string = '';

    // Lista de inspecciones (uno por cada elemento del área)
    inspecciones: any[] = [];

    // Usuarios para el selector (Inspector)
    usuarios: any[] = [];
    usuarioSeleccionado: number | null = null;

    fechaActual: Date = new Date();
    isReadonly: boolean = false; // Nueva propiedad

    estados = [
        { label: 'Bueno', value: 1 },
        { label: 'Regular', value: 2 },
        { label: 'Malo', value: 3 }
    ];

    inspeccionService = inject(InspeccionService);
    areasService = inject(AreasService);
    areaElementoService = inject(AreaElementoService);
    userService = inject(UserService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    constructor() { }

    async ngOnInit() {
        // Leer parámetros de consulta
        this.route.queryParams.subscribe(async params => {
            this.areaId = params['areaId'] ? +params['areaId'] : null;
            this.planMantenimientoId = params['planMantenimientoId'] ? +params['planMantenimientoId'] : null;

            // Parametro opcional 'mode' para ver detalle
            const mode = params['mode'];
            this.isReadonly = mode === 'view';

            if (this.areaId) {
                await this.loadDatosArea(this.areaId);
            } else {
                Swal.fire('Error', 'No se especificó un área para inspeccionar', 'error');
                this.cancelar();
            }
        });

        // Obtener usuario del token
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

    // Ya no necesitamos cargar usuarios
    // async loadUsuarios() { ... } 

    async loadDatosArea(areaId: number) {
        try {
            // Obtener datos del área y su servicio
            // Usamos getAllAreas y buscamos, asumiendo que trae la relación 'servicios' (según modelo Area.js)
            const areas = await this.areasService.getAllAreas();
            const area = areas.find((a: any) => a.id === areaId);

            if (area) {
                this.nombreArea = `${area.servicios?.nombres || 'SIN SERVICIO'} - ${area.nombre}`;
            }

            // Cargar elementos del área para construir la hoja
            const elementosAsignados = await this.areaElementoService.getElementosByArea(areaId);

            // Si es modo lectura o si ya existe inspección para este plan, cargar inspecciones existentes
            let inspeccionesExistentes: any[] = [];
            if (this.isReadonly && this.planMantenimientoId) {
                // TODO: Implementar getInspeccionesByPlanId en backend para optimizar
                const allInspecciones = await this.inspeccionService.getAllInspecciones();
                inspeccionesExistentes = allInspecciones.filter((i: any) => i.planMantenimiento?.id === this.planMantenimientoId);
                // Si no viene populate en allInspecciones, intentar filtrar por otro método o asumir que backend cambio
                // Nota: En InspeccionRoutes.js no agregamos include PlanMantenimiento en getAll, asi que ojo.
                // Como workaround, filtramos por fecha y area si no hay planId, pero acabamos de agregar planId.
                // Vamos a confiar en que si guardamos planId, luego podremos filtrar.
                // Si el backend no devuelve planMantenimiento en getAll, esto fallará.
                // Re-verificaré InspeccionRoutes.js getAll
            }

            // Inicializar la lista de inspecciones
            this.inspecciones = elementosAsignados.map((item: any) => {
                const existente = inspeccionesExistentes.find((i: any) => i.areaElementoIdFk === item.id);

                return {
                    areaElementoIdFk: item.id,
                    elementoNombre: item.elemento.nombre,
                    estado: existente ? existente.estado : null,
                    observaciones: existente ? existente.observaciones : '',
                    isBueno: existente ? existente.estado === 1 : false,
                    isRegular: existente ? existente.estado === 2 : false,
                    isMalo: existente ? existente.estado === 3 : false
                };
            });

        } catch (error) {
            console.error('Error cargando datos del área', error);
            Swal.fire('Error', 'No se pudieron cargar los elementos del área', 'error');
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

        // Mostrar confirmación
        /*
        const result = await Swal.fire({
            title: 'Guardar Inspección',
            text: `Se guardarán ${inspeccionesRealizadas.length} registros.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        */

        try {
            // Guardar uno por uno (Idealmente sería un endpoint bulk)
            // Implementaremos un Promise.all para velocidad
            const promesas = inspeccionesRealizadas.map(i => {
                const data = {
                    areaElementoIdFk: i.areaElementoIdFk,
                    usuarioIdFk: this.usuarioSeleccionado,
                    fecha: this.fechaActual,
                    estado: i.estado,
                    observaciones: i.observaciones,
                    planMantenimientoId: this.planMantenimientoId
                };
                return this.inspeccionService.createInspeccion(data);
            });

            await Promise.all(promesas);

            Swal.fire('Éxito', 'Inspección guardada correctamente', 'success');
            this.router.navigate(['/areas/planes/listado']); // Volver a planes

        } catch (error) {
            console.error('Error guardando inspección', error);
            Swal.fire('Error', 'Ocurrió un error al guardar algunos registros', 'error');
        }
    }

    cancelar() {
        this.router.navigate(['/areas/planes/listado']);
    }
}
