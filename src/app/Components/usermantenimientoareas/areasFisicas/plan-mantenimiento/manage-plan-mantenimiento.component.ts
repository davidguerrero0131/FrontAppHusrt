import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage-plan-mantenimiento',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, DropdownModule, InputNumberModule, TooltipModule],
    templateUrl: './manage-plan-mantenimiento.component.html',
    styleUrls: ['./manage-plan-mantenimiento.component.css']
})
export class ManagePlanMantenimientoComponent implements OnInit {

    planForm: FormGroup;
    isEditMode: boolean = false;
    planId: number | null = null;
    areas: any[] = [];

    meses = [
        { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 }, { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 }, { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
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
            responsable: ['', Validators.required],
            mes: [null, Validators.required],
            anio: [new Date().getFullYear(), Validators.required],
            diaRangoInicio: [null, [Validators.required, Validators.min(1), Validators.max(31)]],
            diaRangoFin: [null, [Validators.required, Validators.min(1), Validators.max(31)]],
            estado: [1]
        });

        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 2; i <= currentYear + 5; i++) {
            this.anios.push({ label: i.toString(), value: i });
        }
    }

    async ngOnInit() {
        await this.loadAreas();
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.planId = +id;
                this.loadPlan(this.planId);
            }
        });
    }

    async loadAreas() {
        try {
            this.areas = await this.areasService.getAllAreas();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar las áreas', 'error');
        }
    }

    async loadPlan(id: number) {
        try {
            const plan = await this.planService.getPlanById(id);
            this.planForm.patchValue({
                areaId: plan.areaId, // El backend devuelve camelCase normalmente
                actividad: plan.actividad,
                responsable: plan.responsable,
                mes: plan.mes,
                anio: plan.anio,
                diaRangoInicio: plan.diaRangoInicio,
                diaRangoFin: plan.diaRangoFin,
                estado: plan.estado
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo cargar el plan', 'error');
            this.router.navigate(['/areas/planes/listado']);
        }
    }

    async guardar() {
        if (this.planForm.invalid) {
            this.planForm.markAllAsTouched();
            return;
        }

        const planData = this.planForm.value;

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
                this.router.navigate(['/areas/planes/listado']);
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', error.error?.error || 'No se pudo guardar el plan', 'error');
        }
    }

    cancelar() {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else {
            this.router.navigate(['/areas/planes/listado']);
        }
    }
}
