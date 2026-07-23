import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspaciosReservaService, EspacioReserva } from '../../../Services/EspaciosReserva/espacios-reserva.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-lista-espacios-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './lista-espacios-reserva.component.html',
  styleUrls: ['./lista-espacios-reserva.component.css']
})
export class ListaEspaciosReservaComponent implements OnInit {

  espacios: EspacioReserva[] = [];
  usuarios: any[] = [];
  
  espacioDialog: boolean = false;
  espacio: EspacioReserva = this.getEmptyEspacio();
  isEdit: boolean = false;
  
  opcionesDisponibilidad = [
    { label: 'Todos los días', value: 'TODOS_LOS_DIAS' },
    { label: 'Entre semana', value: 'ENTRE_SEMANA' },
    { label: 'Días específicos', value: 'DIAS_ESPECIFICOS' }
  ];
  
  opcionesDias = [
    { label: 'Lunes', value: 'Lunes' },
    { label: 'Martes', value: 'Martes' },
    { label: 'Miércoles', value: 'Miércoles' },
    { label: 'Jueves', value: 'Jueves' },
    { label: 'Viernes', value: 'Viernes' },
    { label: 'Sábado', value: 'Sábado' },
    { label: 'Domingo', value: 'Domingo' }
  ];
  
  diasSeleccionados: string[] = [];

  constructor(
    private espaciosService: EspaciosReservaService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadEspacios();
    this.loadUsuarios();
  }

  getEmptyEspacio(): EspacioReserva {
    return {
      nombre: '',
      ubicacion: '',
      aforoMinimo: 0,
      aforoMaximo: 0,
      tipoDisponibilidad: 'TODOS_LOS_DIAS',
      diasEspecificos: null,
      horaInicio: '06:00',
      horaFin: '20:00',
      estado: true,
      responsablesIds: []
    };
  }

  loadEspacios() {
    this.espaciosService.getEspacios().subscribe(
      res => this.espacios = res,
      err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los espacios' })
    );
  }

  async loadUsuarios() {
    try {
      const res = await this.userService.getAllUsers();
      this.usuarios = res.map((u: any) => ({
        label: `${u.nombres} ${u.apellidos}`,
        value: u.id
      }));
    } catch (err) {
      console.error('Error al cargar usuarios');
    }
  }

  openNew() {
    this.espacio = this.getEmptyEspacio();
    this.diasSeleccionados = [];
    this.isEdit = false;
    this.espacioDialog = true;
  }

  editEspacio(esp: EspacioReserva) {
    this.espacio = { ...esp };
    this.diasSeleccionados = esp.diasEspecificos ? esp.diasEspecificos.split(',') : [];
    
    // Extraer IDs de responsables
    this.espacio.responsablesIds = esp.responsables ? esp.responsables.map((r: any) => r.id) : [];
    
    // Fallbacks para tiempos si vienen nulos
    if (!this.espacio.horaInicio) this.espacio.horaInicio = '06:00';
    if (!this.espacio.horaFin) this.espacio.horaFin = '20:00';
    if (this.espacio.horaInicio.length > 5) this.espacio.horaInicio = this.espacio.horaInicio.substring(0,5);
    if (this.espacio.horaFin.length > 5) this.espacio.horaFin = this.espacio.horaFin.substring(0,5);

    this.isEdit = true;
    this.espacioDialog = true;
  }

  hideDialog() {
    this.espacioDialog = false;
  }

  saveEspacio() {
    if (this.espacio.nombre.trim() && this.espacio.ubicacion.trim()) {
      
      if (this.espacio.tipoDisponibilidad === 'DIAS_ESPECIFICOS') {
        this.espacio.diasEspecificos = this.diasSeleccionados.length > 0 ? this.diasSeleccionados.join(',') : null;
      } else {
        this.espacio.diasEspecificos = null;
      }

      if (this.isEdit && this.espacio.id) {
        this.espaciosService.updateEspacio(this.espacio.id, this.espacio).subscribe(
          res => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio actualizado' });
            this.loadEspacios();
            this.espacioDialog = false;
          },
          err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' })
        );
      } else {
        this.espaciosService.createEspacio(this.espacio).subscribe(
          res => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio creado' });
            this.loadEspacios();
            this.espacioDialog = false;
          },
          err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' })
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Nombre y ubicación son obligatorios' });
    }
  }

  deleteEspacio(esp: EspacioReserva) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de desactivar el espacio ${esp.nombre}?`,
      header: 'Confirmar Inactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.espaciosService.deleteEspacio(esp.id!).subscribe(
          res => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio desactivado' });
            this.loadEspacios();
          },
          err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar' })
        );
      }
    });
  }

  getResponsablesNames(responsables: any[]): string {
    if (!responsables || responsables.length === 0) return 'Sin asignar';
    return responsables.map(r => `${r.nombres} ${r.apellidos}`).join(', ');
  }
}
