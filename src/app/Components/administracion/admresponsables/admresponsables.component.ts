import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  TableModule, Table  } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { ResponsableService } from './../../../Services/appServices/biomedicaServices/responsable/responsable.service';
import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../utilidades';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { UppercaseDirective } from '../../../Directives/uppercase.directive';

@Component({
    selector: 'app-admresponsables',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule,
        TableModule, InputTextModule, ButtonModule, DialogModule, ToolbarModule, TooltipModule, TagModule,
        InputSwitchModule, InputNumberModule, IconFieldModule, InputIconModule, UppercaseDirective
    , DropdownModule],
    templateUrl: './admresponsables.component.html',
    styleUrl: './admresponsables.component.css'
})
export class AdmResponsablesComponent implements OnInit {

    responsableService = inject(ResponsableService);
    formBuilder = inject(FormBuilder);

    responsables: any[] = [];
    loading: boolean = false;
    viewModal: boolean = false;
    isEditing: boolean = false;
    selectedResponsable: any;

    formGroup: FormGroup;
    areasAsociadas = [
        { label: 'Biomédica', value: 'BIOMEDICA' },
        { label: 'Sistemas (TI)', value: 'TI' },
        { label: 'Industriales', value: 'INDUSTRIALES' }
    ];
    filteredAreas: any[] = [];
    userRole: string = '';
    @ViewChild('dt') dt!: Table;

    isAdminBiomedica: boolean = false;

    constructor() {
        this.formGroup = this.formBuilder.group({
            nombres: ['', Validators.required],

            garantia: [false, Validators.required],
            externo: [false, Validators.required],
            comodato: [false, Validators.required],
            calificacion: [0, [Validators.required, Validators.min(0)]],
            area_asociada: ['BIOMEDICA', Validators.required]
        });
    }

    async ngOnInit() {
        this.checkRole();
        this.loadResponsables();
    }

    
    checkRole() {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded = getDecodedAccessToken();
            if (decoded?.rol) {
                this.userRole = decoded.rol;
                if (this.userRole === 'SUPERADMIN') {
                    this.filteredAreas = [...this.areasAsociadas];
                } else if (this.userRole === 'SYSTEMADMIN') {
                    this.filteredAreas = this.areasAsociadas.filter(a => a.value === 'TI');
                } else if (this.userRole === 'BIOMEDICAADMIN') {
                    this.filteredAreas = this.areasAsociadas.filter(a => a.value === 'BIOMEDICA');
                } else if (this.userRole === 'ADMINMANTENIMIENTO' || this.userRole === 'MANTENIMIENTOADMIN') {
                    this.filteredAreas = this.areasAsociadas.filter(a => a.value === 'INDUSTRIALES');
                } else {
                    this.filteredAreas = [];
                }
            }
        }
    }

    async loadResponsables() {
        this.loading = true;
        try {
            let res = await this.responsableService.getAllResponsables();
            if (this.userRole !== 'SUPERADMIN') {
                let targetArea = '';
                if (this.userRole === 'SYSTEMADMIN') targetArea = 'TI';
                else if (this.userRole === 'BIOMEDICAADMIN') targetArea = 'BIOMEDICA';
                else if (this.userRole === 'ADMINMANTENIMIENTO' || this.userRole === 'MANTENIMIENTOADMIN') targetArea = 'INDUSTRIALES';
                
                if (targetArea) {
                    res = res.filter((f: any) => f.area_asociada === targetArea);
                } else {
                    res = [];
                }
            }
            this.responsables = res;
        } catch (error) {
            console.error(error);
        }
        this.loading = false;
    }

    onGlobalFilter(event: Event) {
        const target = event.target as HTMLInputElement;
        this.dt.filterGlobal(target.value, 'contains');
    }

    openNew() {
        this.formGroup.reset({
            nombres: '',

            garantia: false,
            externo: false,
            comodato: false,
            calificacion: 0,
            area_asociada: 'BIOMEDICA'
        });
        if (this.filteredAreas.length > 0) {
            this.formGroup.patchValue({ area_asociada: this.filteredAreas[0].value });
        }
        this.isEditing = false;
        this.viewModal = true;
    }

    openEdit(responsable: any) {
        this.selectedResponsable = responsable;
        this.isEditing = true;
        this.formGroup.patchValue({
            nombres: responsable.nombres,

            garantia: responsable.garantia,
            externo: responsable.externo,
            comodato: responsable.comodato,
            calificacion: responsable.calificacion,
            area_asociada: responsable.area_asociada
        });
        this.viewModal = true;
    }

    async saveResponsable() {
        if (this.formGroup.invalid) {
            Swal.fire('Atención', 'Complete todos los campos requeridos correctamente', 'warning');
            return;
        }

        const data = {
            ...this.formGroup.value,
            estado: this.isEditing ? this.selectedResponsable.estado : true
        };

        try {
            if (this.isEditing) {
                await this.responsableService.updateResponsable(this.selectedResponsable.id, data);
                Swal.fire('Éxito', 'Responsable actualizado correctamente', 'success');
            } else {
                await this.responsableService.createResponsable(data);
                Swal.fire('Éxito', 'Responsable creado correctamente', 'success');
            }
            this.viewModal = false;
            this.loadResponsables();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el responsable', 'error');
        }
    }

    async toggleEstado(responsable: any) {
        const newStatus = !responsable.estado;
        const action = newStatus ? 'activar' : 'desactivar';

        Swal.fire({
            title: `¿Desea ${action} el responsable?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.responsableService.updateResponsable(responsable.id, { estado: newStatus });
                    Swal.fire('Actualizado', `Responsable ${newStatus ? 'activado' : 'desactivado'}`, 'success');
                    this.loadResponsables();
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', `No se pudo ${action} el responsable`, 'error');
                }
            }
        });
    }

    async deleteResponsable(responsable: any) {
        Swal.fire({
            title: `¿Desea eliminar el responsable?`,
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.responsableService.deleteResponsable(responsable.id);
                    Swal.fire('Eliminado', 'Responsable eliminado correctamente', 'success');
                    this.loadResponsables();
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'No se pudo eliminar el responsable. Puede estar asociado a equipos.', 'error');
                }
            }
        });
    }
}
