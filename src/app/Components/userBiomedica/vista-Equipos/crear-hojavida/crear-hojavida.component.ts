import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { HojavidaService } from './../../../../Services/appServices/biomedicaServices/hojavida/hojavida.service';
import { ProveedorService } from './../../../../Services/appServices/biomedicaServices/proveedor/proveedor.service';
import { FabricanteService } from './../../../../Services/appServices/biomedicaServices/fabricante/fabricante.service';
import { DatosTecnicosService } from '../../../../Services/appServices/biomedicaServices/datosTecnicos/datos-tecnicos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-hojavida',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    CardModule,
    ToastModule,
    TextareaModule
  ],
  providers: [MessageService],
  templateUrl: './crear-hojavida.component.html',
  styleUrl: './crear-hojavida.component.css'
})
export class CrearHojavidaComponent implements OnInit {

  @Input() equipoId: string | null = null;
  @Input() hojaVidaData: any | null = null;
  @Output() hojaVidaCreated = new EventEmitter<void>();

  hojaVidaForm: FormGroup;
  hojaVidaService = inject(HojavidaService);
  proveedorService = inject(ProveedorService);
  fabricanteService = inject(FabricanteService);
  datosTecnicosService = inject(DatosTecnicosService);
  messageService = inject(MessageService);

  proveedores: any[] = [];
  fabricantes: any[] = [];

  // Enums for dropdowns
  tiposAdquisicion = [
    { label: 'Compra', value: 'Compra' },
    { label: 'Convenio', value: 'Convenio' },
    { label: 'Donación', value: 'Donación' },
    { label: 'Comodato', value: 'Comodato' },
    { label: 'Alquiler', value: 'Alquiler' },
    { label: 'NR', value: 'NR' }
  ];

  fuentes = [
    { label: 'Electricidad', value: 'Electricidad' },
    { label: 'Energia Solar', value: 'Energia Solar' },
    { label: 'Agua', value: 'Agua' },
    { label: 'Gas', value: 'Gas' },
    { label: 'Vapor de agua', value: 'Vapor de agua' },
    { label: 'Derivados del petroleo', value: 'Derivados del petroleo' },
    { label: 'Otra', value: 'Otra' }
  ];

  tiposUso = [
    { label: 'Diagnostico', value: 'Diagnostico' },
    { label: 'Terapéutico', value: 'Terapéutico' },
    { label: 'Soporte Vital', value: 'Soporte Vital' },
    { label: 'Quirúrgico', value: 'Quirúrgico' },
    { label: 'Equipo de laboratorio', value: 'Equipo de laboratorio' },
    { label: 'Rehabilitación', value: 'Rehabilitación' },
    { label: 'Gestión y Soporte Hospitalario', value: 'Gestión y Soporte Hospitalario' },
    { label: 'NR', value: 'NR' }
  ];

  clases = [
    { label: 'Electrico', value: 'Electrico' },
    { label: 'Electronico', value: 'Electronico' },
    { label: 'Mecanico', value: 'Mecanico' },
    { label: 'Electromecanico', value: 'Electromecanico' },
    { label: 'Hidraulico', value: 'Hidraulico' },
    { label: 'Neumatico', value: 'Neumatico' },
    { label: 'Vapor', value: 'Vapor' },
    { label: 'Solar', value: 'Solar' },
    { label: 'Otro', value: 'Otro' }
  ];

  mantenimientos = [
    { label: 'Propio', value: 'Propio' },
    { label: 'Contratado', value: 'Contratado' },
    { label: 'Comodato', value: 'Comodato' },
    { label: 'Garantia', value: 'Garantia' }
  ];

  propiedades = [
    { label: 'Hospital', value: 'Hospital' },
    { label: 'Proveedor', value: 'Proveedor' },
    { label: 'otro', value: 'otro' }
  ];

  opcionesBinarias = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];

  constructor(private fb: FormBuilder) {
    this.hojaVidaForm = this.fb.group({
      codigoInternacional: [''],
      anoIngreso: [null],
      contrato: [''],
      proveedorIdFk: [null],
      fabricanteIdFk: [null],
      tipoAdquisicion: [''],
      fechaCompra: [null],
      fechaInstalacion: [null],
      fechaIncorporacion: [null],
      fechaVencimientoGarantia: [null],
      costoCompra: [null],
      fuente: [''],
      tipoUso: [''],
      clase: [''],
      mantenimiento: [''],
      propiedad: [''],
      equipoPortatil: [null],
      observaciones: [''],
      // Datos Tecnicos
      vMaxOperacion: [''],
      vMinOperacion: [''],
      iMaxOperacion: [''],
      iMinOperacion: [''],
      wConsumida: [''],
      frecuencia: [''],
      presion: [''],
      velocidad: [''],
      temperatura: [''],
      peso: [''],
      capacidad: ['']
    });
  }

  ngOnInit(): void {
    if (!this.equipoId && !this.hojaVidaData) {
      console.error("Equipo ID no proporcionado a CrearHojavidaComponent");
    }

    this.cargarListas();

    if (this.hojaVidaData) {
      this.cargarDatosEdicion();
    }
  }

  async cargarListas() {
    try {
      this.proveedores = await this.proveedorService.getProveedores();
      this.fabricantes = await this.fabricanteService.getFabricantes();
    } catch (error) {
      console.error("Error cargando listas", error);
    }
  }

  cargarDatosEdicion() {
    if (this.hojaVidaData) {
      // Formatear fechas si vienen como strings ISO
      const formatDate = (dateString: string) => dateString ? new Date(dateString) : null;

      // Extract IDs for dropdowns if they come as nested objects (common in Sequelize includes)
      const proveedorId = this.hojaVidaData.proveedorIdFk || this.hojaVidaData.proveedor?.id;
      const fabricanteId = this.hojaVidaData.fabricanteIdFk || this.hojaVidaData.fabricante?.id;

      this.hojaVidaForm.patchValue({
        ...this.hojaVidaData,
        proveedorIdFk: proveedorId,
        fabricanteIdFk: fabricanteId,
        fechaCompra: formatDate(this.hojaVidaData.fechaCompra),
        fechaInstalacion: formatDate(this.hojaVidaData.fechaInstalacion),
        fechaIncorporacion: formatDate(this.hojaVidaData.fechaIncorporacion),
        fechaVencimientoGarantia: formatDate(this.hojaVidaData.fechaVencimientoGarantia),
        // Datos Tecnicos (Si existen)
        vMaxOperacion: this.hojaVidaData.datosTecnicos?.vMaxOperacion,
        vMinOperacion: this.hojaVidaData.datosTecnicos?.vMinOperacion,
        iMaxOperacion: this.hojaVidaData.datosTecnicos?.iMaxOperacion,
        iMinOperacion: this.hojaVidaData.datosTecnicos?.iMinOperacion,
        wConsumida: this.hojaVidaData.datosTecnicos?.wConsumida,
        frecuencia: this.hojaVidaData.datosTecnicos?.frecuencia,
        presion: this.hojaVidaData.datosTecnicos?.presion,
        velocidad: this.hojaVidaData.datosTecnicos?.velocidad,
        temperatura: this.hojaVidaData.datosTecnicos?.temperatura,
        peso: this.hojaVidaData.datosTecnicos?.peso,
        capacidad: this.hojaVidaData.datosTecnicos?.capacidad
      });
    }
  }

  async onSubmit() {
    if (this.hojaVidaForm.valid) {
      try {
        const formValue = this.hojaVidaForm.value;

        const datosTecnicosPayload = {
          vMaxOperacion: formValue.vMaxOperacion,
          vMinOperacion: formValue.vMinOperacion,
          iMaxOperacion: formValue.iMaxOperacion,
          iMinOperacion: formValue.iMinOperacion,
          wConsumida: formValue.wConsumida,
          frecuencia: formValue.frecuencia,
          presion: formValue.presion,
          velocidad: formValue.velocidad,
          temperatura: formValue.temperatura,
          peso: formValue.peso,
          capacidad: formValue.capacidad
        };

        let datosTecnicosId = this.hojaVidaData?.datosTecnicos?.id;

        // Manejo de Datos TÃ©cnicos
        if (this.hojaVidaData && datosTecnicosId) {
          // Actualizar existentes
          await this.datosTecnicosService.updateDatosTecnicos(datosTecnicosId, datosTecnicosPayload);
        } else {
          // Crear nuevos (ya sea para nueva hoja de vida o hoja existente sin datos)
          const newDatos = await this.datosTecnicosService.addDatosTecnicos(datosTecnicosPayload);
          datosTecnicosId = newDatos.id;
        }

        // Si hay hojaVidaData, es una ediciÃ³n
        if (this.hojaVidaData) {
          const payload = {
            ...formValue,
            equipoIdFk: this.hojaVidaData.equipoIdFk,
            datosTecnicosIdFk: datosTecnicosId
          };

          await this.hojaVidaService.updateHojaVida(this.hojaVidaData.id, payload);
          Swal.fire({
            icon: 'success',
            title: 'Hoja de Vida Actualizada',
            text: 'La hoja de vida y sus datos tÃ©cnicos se han actualizado correctamente.'
          });
        } else {
          // CreaciÃ³n nueva
          const payload = {
            ...formValue,
            equipoIdFk: this.equipoId,
            datosTecnicosIdFk: datosTecnicosId
          };
          console.log("Enviando hoja de vida:", payload);
          await this.hojaVidaService.addHojaVida(payload);

          Swal.fire({
            icon: 'success',
            title: 'Hoja de Vida Creada',
            text: 'La hoja de vida y sus datos tÃ©cnicos se han creado correctamente.'
          });
        }

        this.hojaVidaCreated.emit();

      } catch (error: any) {
        console.error('Error al guardar hoja de vida:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar la hoja de vida. ' + (error?.error?.error || error.message)
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: 'Por favor revise los campos del formulario.'
      });
    }
  }
}
