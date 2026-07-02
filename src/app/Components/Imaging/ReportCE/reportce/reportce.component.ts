import { Component, OnInit } from '@angular/core';
import { ImagingService } from '../../../../Services/Imaging/imaging.service';
import { EntidadService } from '../../../../Services/Servinte/entidad.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



@Component({
  selector: 'app-reportce',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule, CommonModule],
  templateUrl: './reportce.component.html',
  styleUrl: './reportce.component.css'
})
export class ReportceComponent implements OnInit {

  formDate: FormGroup;

  cites!: any[];
  entidad!: any[];

  constructor(
    private imagingService: ImagingService,
    private entidadService: EntidadService,
    private formBuilder: FormBuilder
  ) {
    this.formDate = this.formBuilder.group({
      fechaI: ['', Validators.required],
      fechaF: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  async updateCitesDate() {
    // 1. Bucle: Obtener el nombre de la empresa para quienes no lo tienen
    for (let index = 0; index < this.cites.length; index++) {
      const element = this.cites[index];
      if (!element.empresa) {
        try {
          const entidadRes = await this.entidadService.getentidadPaciente(element.id_Unico);
          if (entidadRes && entidadRes[0] != null) {
            element.codigo_Empresa = entidadRes[0].EMPDETADM || entidadRes[0].EMPCOD;
            element.empresa = entidadRes[0].EMPNOM;
          }
        } catch (error) {
          console.error('Error al obtener entidad paciente para ID', element.id_Unico, error);
        }
      }
    }

    // 2. Bucle: Obtener el código de empresa para quienes no lo traen, usando el nombre
    for (let index = 0; index < this.cites.length; index++) {
      const element = this.cites[index];
      if (!element.codigo_Empresa && element.empresa) {
        try {
          const empresaObj = { nombre: element.empresa };
          const entidadRes = await this.entidadService.getDatosEntidad(empresaObj);
          if (entidadRes && entidadRes[0] != null) {
            element.codigo_Empresa = entidadRes[0].EMPDETADM || entidadRes[0].EMPCOD;
            element.EAPB = entidadRes[0].EMPDETADM;
          }
        } catch (error) {
          console.error('Error al obtener datos entidad para', element.empresa, error);
        }
      }
    }

    // 3. Bucle: Obtener/calcular régimen para todos los que no lo traen
    for (let index = 0; index < this.cites.length; index++) {
      const element = this.cites[index];
      if (!element.regimen && element.empresa) {
        try {
          const empresaTrimmed = String(element.empresa).trim();
          const lastChar = empresaTrimmed.charAt(empresaTrimmed.length - 1).toUpperCase();
          
          let tipo = 'REGIMENES ESPECIALES';
          if (lastChar === 'S') {
            tipo = 'SUBSIDIADO';
          } else if (lastChar === 'C') {
            tipo = 'CONTRIBUTIVO';
          }
          
          element.tipo_Usuario = tipo;
          element.regimen = tipo;
        } catch (error) {
          console.error('Error procesando régimen para', element.empresa, error);
        }
      }
    }
  }

  generateExcel() {
    this.exportAsExcelFile(this.cites, 'ReporteMensual');
  }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    XLSX.writeFile(workbook, ReportceComponent.toExportFileName(excelFileName));
  }

  cargando: boolean = false;

  filtrarporFecha() {
    if (this.formDate.value.fechaI && this.formDate.value.fechaF) {
      if (this.compareDatesInput(this.formDate.value.fechaI, this.formDate.value.fechaF)) {
        let obj = {
          fechaI: this.updateDateFormat(this.formDate.value.fechaI) + '',
          fechaF: this.updateDateFormat(this.formDate.value.fechaF) + '',
        };
        console.log(obj);
        
        this.cargando = true; // Activar loading
        
        this.imagingService.getCitesDate(obj).subscribe({
          next: async (data) => {
            if (data && data.body) {
              this.cites = data.body;
              await this.updateCitesDate();
            } else {
              this.cites = [];
            }
            this.cargando = false; // Desactivar loading cuando termina
          },
          error: (err) => {
            console.error('Error al obtener citas:', err);
            this.cargando = false;
            Swal.fire('Error', 'Hubo un problema de conexión al buscar las citas.', 'error');
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Fechas Invalidas',
          text: 'Los rangos de fechas no son validos para la generacion del reporte.',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacios',
        text: 'Debe seleccionar la fecha de inicio y la fecha final para generar el reporte.',
      });
    }
  }

  updateDateFormat(date: String): String {
    const partes = date.split('-');
    if (partes.length === 3) {
      const [año, mes, dia] = partes;
      return dia + '-' + mes + '-' + año;
    }
    return date;
  }

  compareDatesInput(dateI: String, dateF: String): boolean {
    let dateIN: Date = new Date(dateI + "");
    let dateFN: Date = new Date(dateF + "");
    if (dateIN <= dateFN) {
      return true;
    } else {
      return false;
    }
  }
}
