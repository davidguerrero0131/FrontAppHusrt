import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProtocolosService } from './../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { TipoEquipoService } from './../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from "primeng/dialog";
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import Swal from 'sweetalert2';

import { getDecodedAccessToken } from '../../../utilidades';

@Component({
  selector: 'app-admtiposequipo',
  standalone: true,
  imports: [TableModule, TextareaModule, CommonModule, InputIconModule, IconFieldModule, InputTextModule, DialogModule, ReactiveFormsModule, ButtonModule, FormsModule, TooltipModule, ToolbarModule, TagModule, InputSwitchModule],
  templateUrl: './admtiposequipo.component.html',
  styleUrl: './admtiposequipo.component.css'
})
export class AdmtiposequipoComponent implements OnInit {

  formGroup: FormGroup;
  formBuilder = inject(FormBuilder);

  @ViewChild('dt2') dt2!: Table;
  tipoequipoService = inject(TipoEquipoService);
  protocolosServices = inject(ProtocolosService);
  tiposEquipos!: any[];
  loading: boolean = false;
  viewModalTipoEquipo: boolean = false;
  viewAddTipoEquipo: boolean = false;
  tipoEquipoSelected!: any;
  protocoloTipoEquipo!: any[];
  isEditing: boolean = false;
  viewProtocolsModal: boolean = false;
  newProtocoloPaso: string = ''; // For the new protocol input

  isAdminBiomedica: boolean = false;
  isAdminIndustriales: boolean = false; // New flag

  constructor() {
    this.formGroup = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      materialConsumible: ['', [Validators.required]],
      herramienta: ['', [Validators.required]],
      tiempoMinutos: ['', [Validators.required]],
      repuestosMinimos: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      tipoR: ['', [Validators.required]],
      requiereMetrologia: [false]
    });
  }

  async ngOnInit() {
    this.checkRole();
    const all = await this.tipoequipoService.getAllTiposEquipos();

    if (this.isAdminBiomedica) {
      // Filter only Type 1 (Biomedica)
      this.tiposEquipos = all.filter(t => t.tipoR === 1);
    } else if (this.isAdminIndustriales) {
      // Filter only Type 2 (Industriales)
      this.tiposEquipos = all.filter(t => t.tipoR === 2);
    } else {
      this.tiposEquipos = all;
    }
  }

  checkRole() {
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded = getDecodedAccessToken();
      if (decoded?.rol === 'BIOMEDICAADMIN') {
        this.isAdminBiomedica = true;
      } else if (decoded?.rol === 'INDUSTRIALESADMIN') { // Check for Industrial Admin
        this.isAdminIndustriales = true;
      }
    }
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt2.filterGlobal(target.value, 'contains');
    }
  }

  async viewTipoEquipo(tipoEquipo: any) {
    this.tipoEquipoSelected = tipoEquipo;
    this.protocoloTipoEquipo = await this.protocolosServices.getProtocoloTipoEquipo(this.tipoEquipoSelected.id);
    this.viewProtocolsModal = true;
  }

  viewModalAddTipoEquipo() {
    this.formGroup.reset();
    if (this.isAdminBiomedica) {
      this.formGroup.patchValue({ tipoR: 1 }); // Force Biomedica
    } else if (this.isAdminIndustriales) {
      this.formGroup.patchValue({ tipoR: 2 }); // Force Industriales
    }
    this.isEditing = false;
    this.viewAddTipoEquipo = true;
  }

  openEditModal(tipoEquipo: any) {
    this.tipoEquipoSelected = tipoEquipo;
    this.isEditing = true;
    this.formGroup.patchValue({
      nombres: tipoEquipo.nombres,
      materialConsumible: tipoEquipo.materialConsumible,
      herramienta: tipoEquipo.herramienta,
      tiempoMinutos: tipoEquipo.tiempoMinutos,
      repuestosMinimos: tipoEquipo.repuestosMinimos || 'No aplica',
      actividad: tipoEquipo.actividad || 'Mantenimiento Preventivo',
      tipoR: tipoEquipo.tipoR,
      requiereMetrologia: tipoEquipo.requiereMetrologia || false
    });
    this.viewAddTipoEquipo = true;
  }

  async saveTipoEquipo() {
    if (this.formGroup.valid) {
      if (this.isEditing) {
        // Update
        try {
          await this.tipoequipoService.actualizarTipoEquipo(this.tipoEquipoSelected.id, this.formGroup.value);
          this.tiposEquipos = await this.tipoequipoService.getAllTiposEquipos();
          this.viewAddTipoEquipo = false;
          Swal.fire("Tipo de Equipo actualizado!", "", "success");
        } catch (error) {
          Swal.fire("Error al actualizar", "No se pudo actualizar", "error");
        }
      } else {
        // Create
        Swal.fire("Funcionalidad en desarrollo", "La creación de equipos se habilitará pronto", "info");
      }
    } else {
      Swal.fire("Formulario inválido", "Completa los campos", "warning");
    }
  }


  async estadoTipoEquipo(idTipoEquipo: any, accion: string) {
    if (accion === 'A') {
      Swal.fire({
        title: "Desea activar el Tipo de equipo?",
        showCancelButton: true,
        confirmButtonText: "Activar",
        cancelButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await this.tipoequipoService.activarTipoEquipo(idTipoEquipo);
          this.tiposEquipos = await this.tipoequipoService.getAllTiposEquipos();
          Swal.fire("Tipo de equipo activo!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Se descarto la activacion del tipo de equipo", "", "info");
        }
      });
    } else if (accion === 'D') {
      Swal.fire({
        title: "Desea desactivar el tipo de equipo?",
        showCancelButton: true,
        confirmButtonText: "Desactivar",
        cancelButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await this.tipoequipoService.desactivarTipoEquipo(idTipoEquipo);
            this.tiposEquipos = await this.tipoequipoService.getAllTiposEquipos();
            Swal.fire("Tipo de equipo Inactivo!", "", "success");
          } catch {
            Swal.fire("El tipo de quipo tiene equipos activos relacionados", "", "error");
          }
        } else if (result.isDenied) {
          Swal.fire("Se descarto la activacion del tipo de equipo", "", "info");
        }
      });
    }
  }

  async toggleProtocolStatus(protocolo: any) {
    const action = protocolo.estado ? 'desactivar' : 'activar';
    const newStatus = !protocolo.estado;

    try {
      await this.protocolosServices.updateProtocolo(protocolo.id, { estado: newStatus });
      // Refresh the list
      this.protocoloTipoEquipo = await this.protocolosServices.getProtocoloTipoEquipo(this.tipoEquipoSelected.id);

      const toastMsg = newStatus ? 'Protocolo habilitado' : 'Protocolo deshabilitado';
      const toastIcon = newStatus ? 'success' : 'info'; // SweetAlert icons

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: toastIcon,
        title: toastMsg
      });

    } catch (error) {
      console.error(error);
      Swal.fire("Error", `No se pudo ${action} el protocolo`, "error");
    }
  }

  async addProtocolo() {
    if (!this.newProtocoloPaso.trim()) {
      Swal.fire("Atención", "Escribe la descripción del paso", "warning");
      return;
    }

    const newProto = {
      paso: this.newProtocoloPaso,
      estado: true,
      tipoEquipoIdFk: this.tipoEquipoSelected.id
    };

    try {
      await this.protocolosServices.createProtocolo(newProto);
      this.newProtocoloPaso = ''; // Reset input
      // Refresh list
      this.protocoloTipoEquipo = await this.protocolosServices.getProtocoloTipoEquipo(this.tipoEquipoSelected.id);
      Swal.fire({
        icon: 'success',
        title: 'Protocolo agregado',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo agregar el protocolo", "error");
    }
  }
}
