import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ElementosService } from '../../../../../Services/appServices/areasFisicas/elementos.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage-elemento',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule],
    templateUrl: './manage-elemento.component.html',
    styleUrls: ['./manage-elemento.component.css']
})
export class ManageElementoComponent implements OnInit {

    elementoForm: FormGroup;
    isEditMode: boolean = false;
    elementoId: number | null = null;

    elementosService = inject(ElementosService);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.elementoForm = this.fb.group({
            nombre: ['', Validators.required],
            estado: [true]
        });
    }

    async ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.elementoId = +id;
                this.loadElemento(this.elementoId);
            }
        });
    }

    async loadElemento(id: number) {
        try {
            const elemento = await this.elementosService.getElementoById(id);
            if (elemento) {
                this.elementoForm.patchValue({
                    nombre: elemento.nombre,
                    estado: elemento.estado
                });
            }
        } catch (error) {
            console.error('Error cargando elemento', error);
            Swal.fire('Error', 'No se pudo cargar la información del elemento', 'error');
            this.router.navigate(['/elementos/listado']);
        }
    }

    async guardar() {
        if (this.elementoForm.invalid) {
            this.elementoForm.markAllAsTouched();
            Swal.fire('Atención', 'Por favor complete todos los campos requeridos', 'warning');
            return;
        }

        const elementoData = this.elementoForm.value;

        try {
            if (this.isEditMode && this.elementoId) {
                await this.elementosService.updateElemento(this.elementoId, elementoData);
                Swal.fire('Éxito', 'Elemento actualizado correctamente', 'success');
            } else {
                await this.elementosService.createElemento(elementoData);
                Swal.fire('Éxito', 'Elemento creado correctamente', 'success');
            }
            this.router.navigate(['/elementos/listado']);
        } catch (error) {
            console.error('Error guardando elemento', error);
            Swal.fire('Error', 'Ocurrió un error al guardar el elemento', 'error');
        }
    }

    cancelar() {
        this.router.navigate(['/elementos/listado']);
    }
}
