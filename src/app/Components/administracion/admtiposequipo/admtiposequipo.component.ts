import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProtocolosService } from './../../../Services/appServices/biomedicaServices/protocolos/protocolos.service';
import { TipoEquipoService } from './../../../Services/appServices/general/tipoEquipo/tipo-equipo.service';
import { ChequeosIndustrialesService } from '../../../Services/chequeos-industriales.service';
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
  chequeosService = inject(ChequeosIndustrialesService);
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
  isAdminIndustriales: boolean = false;

  // Chequeo config modal
  viewChequeoModal: boolean = false;
  tipoSeleccionadoChequeo: any = null;
  configChequeo: any = null;
  itemsChequeo: any[] = [];
  nuevoItem: string = '';
  savingConfig: boolean = false;

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
    await this.cargarTiposIndustriales();
  }

  private async cargarTiposIndustriales() {
    const all = await this.tipoequipoService.getAllTiposEquipos();
    this.tiposEquipos = all.filter((t: any) => t.tipoR === 3);
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
          await this.cargarTiposIndustriales();
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
          await this.cargarTiposIndustriales();
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
            await this.cargarTiposIndustriales();
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

  // ===== Chequeo Config Methods =====
  async abrirModalChequeo(equipo: any) {
    this.tipoSeleccionadoChequeo = equipo;
    this.nuevoItem = '';
    this.configChequeo = null;
    this.itemsChequeo = [];
    try {
      const config = await this.chequeosService.obtenerConfigPorTipo(equipo.id).toPromise();
      this.configChequeo = config;
      this.itemsChequeo = config?.items ?? [];
    } catch {
      // No config yet - that's OK
    }
    this.viewChequeoModal = true;
  }

  async toggleHabilitarChequeo() {
    if (!this.tipoSeleccionadoChequeo) return;
    this.savingConfig = true;
    try {
      if (!this.configChequeo) {
        const nombre = this.tipoSeleccionadoChequeo.nombres as string;
        const identificador = nombre.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_');
        const config = await this.chequeosService.crearConfig({
          tipoEquipoIdFk: this.tipoSeleccionadoChequeo.id,
          identificadorString: identificador,
          label: nombre,
          color: '#0d7377'
        }).toPromise();
        this.configChequeo = config;
      } else {
        const updated = await this.chequeosService.toggleConfig(this.configChequeo.id).toPromise();
        this.configChequeo = { ...this.configChequeo, habilitado: updated.habilitado };
      }
      const msg = this.configChequeo.habilitado ? 'Habilitado en chequeos diarios' : 'Deshabilitado de chequeos diarios';
      Swal.fire({ icon: 'success', title: msg, timer: 1800, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la configuracion.' });
    }
    this.savingConfig = false;
  }

  async agregarItemChequeo() {
    if (!this.nuevoItem.trim() || !this.configChequeo) return;
    try {
      const item = await this.chequeosService.agregarItemConfig(this.configChequeo.id, this.nuevoItem.trim()).toPromise();
      this.itemsChequeo = [...this.itemsChequeo, item];
      this.nuevoItem = '';
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar el item.' });
    }
  }

  async eliminarItemChequeo(itemId: number) {
    try {
      await this.chequeosService.eliminarItemConfig(itemId).toPromise();
      this.itemsChequeo = this.itemsChequeo.filter((i: any) => i.id !== itemId);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el item.' });
    }
  }
}