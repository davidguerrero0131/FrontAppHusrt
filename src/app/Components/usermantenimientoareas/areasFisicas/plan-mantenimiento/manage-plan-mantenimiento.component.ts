import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import Swal from 'sweetalert2';

import { DividerModule } from 'primeng/divider';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../../../../constantes';
import { createHeaders } from '../../../../utilidades';

@Component({
    selector: 'app-manage-plan-mantenimiento',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, SelectModule, InputNumberModule, TooltipModule, MantenimientoadminnavbarComponent, DividerModule],
    templateUrl: './manage-plan-mantenimiento.component.html',
    styleUrls: ['./manage-plan-mantenimiento.component.css']
})
export class ManagePlanMantenimientoComponent implements OnInit {

    planForm: FormGroup;
    isEditMode: boolean = false;
    isViewing: boolean = false;
    hasExistingPlan: boolean = false;
    planId: number | null = null;
    areas: any[] = [];
    tecnicos: any[] = [];
    private http = inject(HttpClient);

    meses = [
        { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 }, { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 }, { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
    ];

    periodicidades = [
        { label: 'Mensual (Cada mes)', value: 1 },
        { label: 'Bimestral (Cada 2 meses)', value: 2 },
        { label: 'Trimestral (Cada 3 meses)', value: 3 },
        { label: 'Cuatrimestral (Cada 4 meses)', value: 4 },
        { label: 'Semestral (Cada 6 meses)', value: 6 },
        { label: 'Anual (Cada 12 meses)', value: 12 }
    ];

    anios: any[] = [];

    fb = inject(FormBuilder);
    planService = inject(PlanMantenimientoService);
    areasService = inject(AreasService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    constructor() {
        this.planForm = this.fb.group({
            areaId: [null, Validators.required],
            actividad: ['', Validators.required],
            responsable: [''],
            tecnicoId: [null],
            periodicidad: [1, Validators.required],
            mes: [null, Validators.required],
            anio: [new Date().getFullYear(), Validators.required],
            diaRangoInicio: [null, [Validators.required, Validators.min(1), Validators.max(31)]],
            diaRangoFin: [null, [Validators.required, Validators.min(1), Validators.max(31)]],
            estado: [1]
        });

        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 2; i <= currentYear + 10; i++) {
            this.anios.push({ label: i.toString(), value: i });
        }
    }

    async ngOnInit() {
        await this.loadAreas();
        await this.loadTecnicos();
        this.route.paramMap.subscribe(async params => {
            const id = params.get('id');
            if (id) {
                if (this.router.url.includes('mantenimientos-area')) {
                    try {
                        const planes = await this.planService.getPlanesByArea(+id);
                        if (planes && planes.length > 0) {
                            Swal.fire('Información', 'Esta área ya tiene plan de mantenimiento', 'info');
                            this.isEditMode = true;
                            this.planId = planes[0].id;
                            this.hasExistingPlan = true;
                            this.isViewing = true;
                            this.loadPlan(this.planId!);
                            this.planForm.disable();
                        } else {
                            Swal.fire('Información', 'Vas a agregar un plan de mantenimiento', 'info');
                            this.isEditMode = false;
                            this.hasExistingPlan = false;
                            this.isViewing = false;
                            this.planForm.patchValue({ areaId: +id });
                            this.planForm.enable();
                        }
                    } catch (e) {
                        Swal.fire('Información', 'Vas a agregar un plan de mantenimiento', 'info');
                        this.isEditMode = false;
                        this.hasExistingPlan = false;
                        this.isViewing = false;
                        this.planForm.patchValue({ areaId: +id });
                        this.planForm.enable();
                    }
                } else {
                    this.isEditMode = true;
                    this.planId = +id;
                    this.hasExistingPlan = true;
                    this.isViewing = false;
                    this.loadPlan(this.planId!);
                    this.planForm.enable();
                }
            }
        });
    }

    habilitarEdicion() {
        this.isViewing = false;
        this.planForm.enable();
    }

    async loadAreas() {
        try {
            this.areas = await this.areasService.getAllAreas();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar las áreas', 'error');
        }
    }

    async loadTecnicos() {
        try {
            const allUsers: any = await lastValueFrom(this.http.get(`${API_URL}/users`, createHeaders()));
            this.tecnicos = allUsers
                .filter((u: any) => u.rol && u.rol.nombre === 'TECNICOMANTENIMIENTO')
                .map((t: any) => ({
                    label: `${t.nombres} ${t.apellidos}`,
                    value: t.id
                }));
        } catch (e) {
            console.error('Error cargando técnicos:', e);
        }
    }

    async loadPlan(id: number) {
        try {
            const plan = await this.planService.getPlanById(id);
            this.planForm.patchValue({
                areaId: plan.areaId, // El backend devuelve camelCase normalmente
                actividad: plan.actividad,
                responsable: plan.responsable,
                tecnicoId: plan.tecnicoId,
                periodicidad: plan.periodicidad,
                mes: plan.mesInicio || plan.mes,
                anio: plan.anio,
                diaRangoInicio: plan.diaRangoInicio,
                diaRangoFin: plan.diaRangoFin,
                estado: plan.estado
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo cargar el plan', 'error');
            this.router.navigate(['/adminmantenimiento/gestion-operativa']);
        }
    }

    async guardar() {
        if (this.planForm.invalid) {
            this.planForm.markAllAsTouched();
            return;
        }

        const planData = this.planForm.getRawValue();
        planData.mesInicio = planData.mes; // Mapear 'mes' a 'mesInicio' para el backend

        if (planData.diaRangoInicio > planData.diaRangoFin) {
            Swal.fire('Error', 'El día de inicio no puede ser mayor al día de fin', 'error');
            return;
        }

        try {
            if (this.isEditMode && this.planId) {
                await this.planService.updatePlan(this.planId, planData);
                Swal.fire('Actualizado', 'Plan actualizado correctamente', 'success');
            } else {
                await this.planService.createPlan(planData);
                Swal.fire('Creado', 'Plan creado correctamente', 'success');
            }

            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            if (returnUrl) {
                this.router.navigateByUrl(returnUrl);
            } else {
                this.router.navigate(['/adminmantenimiento/gestion-operativa']);
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', error.error?.error || 'No se pudo guardar el plan', 'error');
        }
    }

    location = inject(Location);

    cancelar() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            // No podemos saber con certeza la ruta exacta del listado anterior (podría ser areas/listado o similar)
            // así que intentamos volver al listado de áreas por defecto si no hay returnUrl
            this.router.navigateByUrl(returnUrl);
        } else {
            this.location.back();
        }
    }
}
