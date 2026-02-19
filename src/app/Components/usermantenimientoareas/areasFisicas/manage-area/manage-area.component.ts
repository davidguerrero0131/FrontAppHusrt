import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { ServicioService } from '../../../../Services/appServices/general/servicio/servicio.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage-area',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, DropdownModule, DialogModule],
    templateUrl: './manage-area.component.html',
    styleUrls: ['./manage-area.component.css']
})
export class ManageAreaComponent implements OnInit {

    areaForm: FormGroup;
    isEditMode: boolean = false;
    areaId: number | null = null;
    servicios: any[] = [];

    ubicacionesOptions = [
        { label: 'Torre 1', value: 'Torre 1' },
        { label: 'Torre 2', value: 'Torre 2' }
    ];

    areasService = inject(AreasService);
    servicioService = inject(ServicioService);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.areaForm = this.fb.group({
            nombre: ['', Validators.required],
            ubicacion: ['', Validators.required],
            descripcion: ['', Validators.required],
            servicioIdFk: [null, Validators.required],
            estado: [true]
        });
    }

    async ngOnInit() {
        await this.loadServicios();

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.areaId = +id;
                this.loadArea(this.areaId);
            }
        });
    }

    async loadServicios() {
        try {
            this.servicios = await this.servicioService.getAllServicios();
        } catch (error) {
            console.error('Error cargando servicios', error);
        }
    }

    async loadArea(id: number) {
        try {
            const area = await this.areasService.getAreaById(id);
            if (area) {
                this.areaForm.patchValue({
                    nombre: area.nombre,
                    ubicacion: area.ubicacion,
                    descripcion: area.descripcion,
                    servicioIdFk: area.servicioIdFk,
                    estado: area.estado
                });
            }
        } catch (error) {
            console.error('Error cargando área', error);
            Swal.fire('Error', 'No se pudo cargar la información del área', 'error');
            this.router.navigate(['/areas/listado']);
        }
    }

    async guardar() {
        if (this.areaForm.invalid) {
            this.areaForm.markAllAsTouched();
            return;
        }

        const areaData = this.areaForm.value;

        try {
            if (this.isEditMode && this.areaId) {
                // Update
                await this.areasService.updateArea(this.areaId, areaData).then(() => {
                    Swal.fire('Éxito', 'Área actualizada correctamente', 'success');
                });
            } else {
                // Create
                await this.areasService.createArea(areaData).then(() => {
                    Swal.fire('Éxito', 'Área creada correctamente', 'success');
                });
            }
            // Navigate back to the service's area list
            if (areaData.servicioIdFk) {
                this.router.navigate(['/adminmantenimiento/areas-por-servicio', areaData.servicioIdFk]);
            } else {
                this.router.navigate(['/areas/listado']);
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    }

    cancelar() {
        const servicioId = this.areaForm.get('servicioIdFk')?.value;
        if (servicioId) {
            this.router.navigate(['/adminmantenimiento/areas-por-servicio', servicioId]);
        } else {
            this.router.navigate(['/areas/listado']);
        }
    }
}
