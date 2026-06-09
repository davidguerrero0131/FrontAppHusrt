import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { EquiposService } from '../../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-baja-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, SelectModule, DatePickerModule, InputTextarea, InputTextModule],
  template: `
<div class="p-4">
    <form [formGroup]="reporteForm" (ngSubmit)="guardar()">
        <div class="row g-3">
            <div class="col-12">
                <label class="block mb-2 font-bold">Fecha de Baja</label>
                <p-datepicker formControlName="fechaBaja" [showIcon]="true" styleClass="w-full" appendTo="body" dateFormat="yy-mm-dd"></p-datepicker>
                <small class="text-red-500" *ngIf="reporteForm.get('fechaBaja')?.invalid && reporteForm.get('fechaBaja')?.touched">
                    La fecha es obligatoria.
                </small>
            </div>

            <div class="col-12">
                <label class="block mb-2 font-bold">Concepto Técnico</label>
                <p-select [options]="conceptosOptions" formControlName="conceptoTecnico" optionLabel="label" optionValue="value" styleClass="w-full" appendTo="body"></p-select>
            </div>

            <div class="col-12">
                <label class="block mb-2 font-bold">Descripción de la Falla</label>
                <textarea pInputTextarea formControlName="descripcionFalla" rows="3" class="w-full" style="resize: none;"></textarea>
                <small class="text-red-500" *ngIf="reporteForm.get('descripcionFalla')?.invalid && reporteForm.get('descripcionFalla')?.touched">
                    La descripción es obligatoria.
                </small>
            </div>

            <div class="col-12">
                <label class="block mb-2 font-bold">Observaciones</label>
                <textarea pInputTextarea formControlName="observaciones" rows="2" class="w-full" style="resize: none;"></textarea>
            </div>
        </div>

        <div class="flex justify-content-end gap-2 mt-4">
            <p-button label="Cancelar" icon="pi pi-times" [outlined]="true" severity="secondary" (click)="cancelar()"></p-button>
            <p-button label="Confirmar Baja" icon="pi pi-check" severity="danger" type="submit"></p-button>
        </div>
    </form>
</div>
  `,
  styles: [`
    :host ::ng-deep .p-datepicker {
        width: 100%;
    }
  `]
})
export class ReporteBajaModalComponent implements OnInit {
  fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  equipoServices = inject(EquiposService);

  reporteForm: FormGroup;
  equipoId: any;

  conceptosOptions = [
    { label: 'Daño irreparable', value: 'Daño irreparable' },
    { label: 'Obsolescencia tecnológica', value: 'Obsolescencia tecnológica' },
    { label: 'Reparación no costo/beneficiosa', value: 'Reparación no costo/beneficiosa' },
    { label: 'Pérdida o hurto', value: 'Pérdida o hurto' },
    { label: 'Otro', value: 'Otro' }
  ];

  constructor() {
    this.reporteForm = this.fb.group({
      fechaBaja: [new Date(), Validators.required],
      descripcionFalla: ['', Validators.required],
      conceptoTecnico: ['Otro', Validators.required],
      observaciones: [''],
      equipoIdFk: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.equipoId = this.config.data.equipoId;
    this.reporteForm.patchValue({ equipoIdFk: this.equipoId });
  }

  async guardar() {
    if (this.reporteForm.valid) {
      try {
        const formValue = this.reporteForm.value;
        const date = formValue.fechaBaja;
        
        // Ensure local date string for backend
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const payload = {
          ...formValue,
          fechaBaja: formattedDate
        };

        await this.equipoServices.addReporteBaja(payload);
        
        Swal.fire({
          title: 'Equipo dado de baja',
          text: 'El reporte de baja se ha guardado y el estado del equipo ha sido actualizado.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          draggable: true
        });
        
        this.ref.close(true);
      } catch (error) {
        console.error('Error al guardar reporte de baja:', error);
        Swal.fire('Error', 'No se pudo procesar la baja del equipo', 'error');
      }
    } else {
      this.reporteForm.markAllAsTouched();
    }
  }

  cancelar() {
    this.ref.close();
  }
}
