import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChequeosIndustrialesService } from '../../../../../Services/chequeos-industriales.service';
import Swal from 'sweetalert2';
import { IndustrialesNavbarComponent } from '../../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
    selector: 'app-formulario-chequeo',
    standalone: true,
    imports: [CommonModule, FormsModule, IndustrialesNavbarComponent],
    templateUrl: './formulario-chequeo.component.html',
    styleUrls: ['./formulario-chequeo.component.css']
})
export class FormularioChequeoComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);
    chequeosService = inject(ChequeosIndustrialesService);

    equipoId!: number;
    tipoEquipoStr!: string;
    equipoNombre: string = '';

    // Modelo dinámico para el formulario
    formData: any = {};

    // Bandera para mostrar opciones semanales (ej. Lunes = 1)
    esDiaSemanal: boolean = false;

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.equipoId = params['equipoId'];
            this.tipoEquipoStr = params['tipo'];
            this.equipoNombre = params['nombre'] || 'Equipo';

            this.esDiaSemanal = new Date().getDay() === 1; // 1 = Lunes (Día de chequeo semanal)
            this.inicializarFormData();
        });
    }

    inicializarFormData() {
        switch (this.tipoEquipoStr) {
            case 'UPS':
                this.formData = { voltajeSalida: '', cargaUpsPorcentaje: '', estadoBateria: '', bypassActivo: '', estadoGeneral: '', observaciones: '' };
                break;
            case 'PLANTAS_ELECTRICAS':
                this.formData = { voltajeBaterias: '', estadoCargador: '', nivelCombustible: '', nivelAceite: '', nivelRefrigerante: '', encendidoNormativo: '', observaciones: '' };
                break;
            case 'CALDERAS':
                this.formData = { presionVapor: '', nivelVisible: '', cicloEncendido: '', bombaAlimentacion: '', sinFugas: '', sinAlarmas: '', purgaFondo: '', purgaColumna: '', purgaControl: '', nivelTanqueCondensado: '', sistemaTratamiento: '', observaciones: '' };
                break;
            case 'TRANSFERENCIAS':
                this.formData = { selectorAuto: '', redNormal: '', sinAlarmas: '', breakersPosicion: '', voltaje: '', observaciones: '' };
                break;
            case 'TRANSFORMADORES':
                this.formData = { voltajeFF: '', voltajeFN: '', sinAlarmas: '', energizado: '', sinSobrecalentamiento: '', observaciones: '' };
                break;
            case 'BOMBAS_AGUA':
                this.formData = { sistemaEnergizado: '', modoAuto: '', sinAlarmas: '', alternancia: '', nivelTanque: '', firmaBomba1: '', firmaBomba2: '', firmaBomba3: '', firmaBombaIncendios: '', observaciones: '' };
                break;
        }
    }

    guardarChequeo() {
        this.formData.equipoIdFk = this.equipoId;

        // Obtenemos el ID del tipo de equipo si lo necesitamos, o el backend lo asume por el string.
        // Asumiremos que el backend lo maneja o que lo pasamos aparte si es necesario.
        // El backend usa tipoEquipoIdentificador para saber qué modelo usar.

        const payload = {
            tipoEquipoIdentificador: this.tipoEquipoStr,
            formData: this.formData
        };

        this.chequeosService.crearChequeo(payload).subscribe({
            next: (res) => {
                Swal.fire('Éxito', res.mensaje, 'success');
                this.regresar();
            },
            error: (err) => {
                Swal.fire('Error', err.error?.error || 'No se pudo guardar el chequeo', 'error');
            }
        });
    }

    regresar() {
    window.history.back();
  }
}
