import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Services
import { TipoEquipoService } from '../../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ProtocoloIndustrialService } from '../../../../Services/appServices/industrialesServices/protocolo/protocolo-industrial.service';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-clasificacion-tipo-equipo-industrial',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        ToolbarModule,
        TooltipModule,
        TagModule,
        InputSwitchModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './clasificacion-tipo-equipo-industrial.component.html',
    styleUrl: './clasificacion-tipo-equipo-industrial.component.css'
})
export class ClasificacionTipoEquipoIndustrialComponent implements OnInit {

    @ViewChild('dt2') dt2!: Table;

    formGroup: FormGroup;
    formBuilder = inject(FormBuilder);

    tipoEquipoService = inject(TipoEquipoService);
    protocolosServices = inject(ProtocoloIndustrialService);

    tiposEquipos: any[] = [];
    tipoEquipoSelected: any;
    protocoloTipoEquipo: any[] = [];

    router = inject(Router);

    loading: boolean = false;
    viewModalAddTipoEquipo: boolean = false;
    viewProtocolsModal: boolean = false;
    isEditing: boolean = false;

    newProtocoloPaso: string = '';

    constructor() {
        this.formGroup = this.formBuilder.group({
            nombres: ['', [Validators.required]],
            materialConsumible: ['', [Validators.required]],
            herramienta: ['', [Validators.required]],
            tiempoMinutos: ['', [Validators.required]],
            repuestosMinimos: ['', [Validators.required]],
            actividad: ['', [Validators.required]],
            tipoR: [3, [Validators.required]], // Default 3 for Industrial
            requiereMetrologia: [false]
        });
    }

    async ngOnInit() {
        this.loadTiposEquipos();
    }

    async loadTiposEquipos() {
        this.loading = true;
        try {
            this.tiposEquipos = await this.tipoEquipoService.getTiposEquiposIndustrial();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los tipos de equipos industriales', 'error');
        } finally {
            this.loading = false;
        }
    }

    onGlobalFilter(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            this.dt2.filterGlobal(target.value, 'contains');
        }
    }

    // --- CRUD TIPO EQUIPO ---

    viewModalAdd() {
        this.isEditing = false;
        this.formGroup.reset();
        this.formGroup.patchValue({
            tipoR: 2,
            requiereMetrologia: false,
            actividad: 'Mantenimiento Preventivo',
            repuestosMinimos: 'No aplica'
        });
        this.viewModalAddTipoEquipo = true;
    }

    openEditModal(tipoEquipo: any) {
        this.isEditing = true;
        this.tipoEquipoSelected = tipoEquipo;
        this.formGroup.patchValue({
            nombres: tipoEquipo.nombres,
            materialConsumible: tipoEquipo.materialConsumible,
            herramienta: tipoEquipo.herramienta,
            tiempoMinutos: tipoEquipo.tiempoMinutos,
            repuestosMinimos: tipoEquipo.repuestosMinimos,
            actividad: tipoEquipo.actividad,
            tipoR: tipoEquipo.tipoR,
            requiereMetrologia: tipoEquipo.requiereMetrologia
        });
        this.viewModalAddTipoEquipo = true;
    }

    async saveTipoEquipo() {
        if (this.formGroup.invalid) {
            Swal.fire('Atención', 'Por favor complete todos los campos requeridos', 'warning');
            return;
        }

        try {
            const data = this.formGroup.value;
            // Ensure specific value for industrial
            // data.tipoR = 2; // Removed as new table implies industrial

            if (this.isEditing) {
                await this.tipoEquipoService.actualizarTipoEquipo(this.tipoEquipoSelected.id, data);
                Swal.fire('Actualizado', 'Tipo de equipo actualizado correctamente', 'success');
            } else {
                const createData = { ...data, activo: true };
                await this.tipoEquipoService.createTipoEquipo(createData);
                Swal.fire('Creado', 'Nuevo tipo de equipo industrial creado', 'success');
            }
            this.viewModalAddTipoEquipo = false;
            this.loadTiposEquipos();

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el tipo de equipo', 'error');
        }
    }

    async estadoTipoEquipo(id: number, accion: 'A' | 'D') {
        if (accion === 'A') {
            Swal.fire({
                title: "Desea activar el Tipo de equipo?",
                showCancelButton: true,
                confirmButtonText: "Activar",
                cancelButtonText: `Cancelar`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await this.tipoEquipoService.activarTipoEquipo(id);
                    this.loadTiposEquipos();
                    Swal.fire("Tipo de equipo activo!", "", "success");
                }
            });
        } else {
            Swal.fire({
                title: "Desea desactivar el tipo de equipo?",
                showCancelButton: true,
                confirmButtonText: "Desactivar",
                cancelButtonText: `Cancelar`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await this.tipoEquipoService.desactivarTipoEquipo(id);
                        this.loadTiposEquipos();
                        Swal.fire("Tipo de equipo Inactivo!", "", "success");
                    } catch {
                        Swal.fire("Error", "El tipo de equipo tiene equipos activos relacionados", "error");
                    }
                }
            });
        }
    }

    viewEquiposTipos(idTipo: any) {
        sessionStorage.setItem("idTipoEquipoIndustrial", idTipo);
        this.router.navigate(['industriales/equipos-tipo']);
    }

    // --- PROTOCOLOS ---

    async viewProtocolos(tipoEquipo: any) {
        this.tipoEquipoSelected = tipoEquipo;
        this.viewProtocolsModal = true;
        this.loadProtocolos();
    }

    async loadProtocolos() {
        try {
            this.protocoloTipoEquipo = await this.protocolosServices.getProtocolosPorTipo(this.tipoEquipoSelected.id);
        } catch (error) {
            console.error(error);
        }
    }

    async addProtocolo() {
        if (!this.newProtocoloPaso.trim()) return;

        const newProto = {
            paso: this.newProtocoloPaso,
            estado: true,
            tipoEquipoIndustrialIdFk: this.tipoEquipoSelected.id
        };

        try {
            await this.protocolosServices.createProtocolo(newProto);
            this.newProtocoloPaso = '';
            this.loadProtocolos();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
            Toast.fire({ icon: 'success', title: 'Protocolo agregado' });

        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el protocolo', 'error');
        }
    }

    async toggleProtocolStatus(protocolo: any) {
        try {
            await this.protocolosServices.updateProtocolo(protocolo.id, { estado: !protocolo.estado });
            this.loadProtocolos();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    }
}
