import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChequeosIndustrialesService } from '../../../../../Services/chequeos-industriales.service';

@Component({
    selector: 'app-consolidado-mensual',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './consolidado-mensual.component.html',
    styleUrls: ['./consolidado-mensual.component.css']
})
export class ConsolidadoMensualComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);
    chequeosService = inject(ChequeosIndustrialesService);

    equipoId!: number;
    tipoEquipoStr!: string;
    equipoNombre: string = '';

    mesActual: number = new Date().getMonth() + 1; // 1-12
    anioActual: number = new Date().getFullYear();

    diasDelMes: number[] = [];
    chequeosMes: any[] = [];

    // Variables para la matriz reactiva
    matrizChequeos: any = {};
    parametrosList: string[] = [];

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.equipoId = params['equipoId'];
            this.tipoEquipoStr = params['tipo'];
            this.equipoNombre = params['nombre'] || 'Equipo';

            this.generarDiasDelMes();
            this.definirParametros();
            this.cargarConsolidado();
        });
    }

    generarDiasDelMes() {
        const diasEnMes = new Date(this.anioActual, this.mesActual, 0).getDate();
        this.diasDelMes = Array.from({ length: diasEnMes }, (_, i) => i + 1);
    }

    definirParametros() {
        switch (this.tipoEquipoStr) {
            case 'UPS':
                this.parametrosList = ['Voltaje Salida', 'Carga %', 'Estado Batería', 'Bypass', 'Estado General'];
                break;
            case 'PLANTAS_ELECTRICAS':
                this.parametrosList = ['Voltaje Baterías', 'Estado Cargador', 'Nivel Combustible', 'Nivel Aceite', 'Nivel Refrigerante', 'Encendido Normativo'];
                break;
            case 'CALDERAS':
                this.parametrosList = ['Presión Vapor', 'Nivel Visible', 'Ciclo Encendido', 'Bomba Alimentación', 'Sin Fugas', 'Sin Alarmas', 'Purga Fondo', 'Purga Columna', 'Purga Control', 'Nivel Tanque', 'Sist. Tratamiento'];
                break;
            case 'TRANSFERENCIAS':
                this.parametrosList = ['Selector Auto', 'Red Normal', 'Sin Alarmas', 'Breakers Posición', 'Voltaje'];
                break;
            case 'TRANSFORMADORES':
                this.parametrosList = ['Voltaje F-F', 'Voltaje F-N', 'Sin Alarmas', 'Energizado', 'Sin Sobrecalentamiento'];
                break;
            case 'BOMBAS_AGUA':
                this.parametrosList = ['Sist. Energizado', 'Modo Auto', 'Sin Alarmas', 'Alternancia', 'Nivel Tanque', 'Firma B1', 'Firma B2', 'Firma B3', 'Firma B.Inc'];
                break;
        }
    }

    cargarConsolidado() {
        this.chequeosService.obtenerConsolidadoMensual(this.tipoEquipoStr, this.equipoId, this.anioActual, this.mesActual)
            .subscribe({
                next: (data) => {
                    this.chequeosMes = data;
                    this.construirMatriz();
                },
                error: (err) => {
                    console.error("Error cargando consolidado", err);
                }
            });
    }

    construirMatriz() {
        // Inicializar matriz vacía
        for (const param of this.parametrosList) {
            this.matrizChequeos[param] = {};
        }

        // Pre-llenar NO APLICA para variables semanales (ej. Lunes) en días que no corresponden
        if (this.tipoEquipoStr === 'PLANTAS_ELECTRICAS') {
            for (const dia of this.diasDelMes) {
                const fechaIterada = new Date(this.anioActual, this.mesActual - 1, dia);
                if (fechaIterada.getDay() !== 1) { // 1 = Lunes
                    this.matrizChequeos['Encendido Normativo'][dia] = 'NO APLICA';
                }
            }
        }

        // Llenar matriz basado en datos
        for (const chequeo of this.chequeosMes) {
            // chequeo.fecha viene como YYYY-MM-DD
            const diaStr = chequeo.fecha.split('-')[2];
            const dia = parseInt(diaStr, 10);

            if (this.tipoEquipoStr === 'UPS') {
                this.matrizChequeos['Voltaje Salida'][dia] = chequeo.voltajeSalida;
                this.matrizChequeos['Carga %'][dia] = chequeo.cargaUpsPorcentaje;
                this.matrizChequeos['Estado Batería'][dia] = chequeo.estadoBateria;
                this.matrizChequeos['Bypass'][dia] = chequeo.bypassActivo;
                this.matrizChequeos['Estado General'][dia] = chequeo.estadoGeneral;
            }
            else if (this.tipoEquipoStr === 'PLANTAS_ELECTRICAS') {
                this.matrizChequeos['Voltaje Baterías'][dia] = chequeo.voltajeBaterias;
                this.matrizChequeos['Estado Cargador'][dia] = chequeo.estadoCargador;
                this.matrizChequeos['Nivel Combustible'][dia] = chequeo.nivelCombustible;
                this.matrizChequeos['Nivel Aceite'][dia] = chequeo.nivelAceite;
                this.matrizChequeos['Nivel Refrigerante'][dia] = chequeo.nivelRefrigerante;
                this.matrizChequeos['Encendido Normativo'][dia] = chequeo.encendidoNormativo;
            }
            else if (this.tipoEquipoStr === 'CALDERAS') {
                this.matrizChequeos['Presión Vapor'][dia] = chequeo.presionVapor;
                this.matrizChequeos['Nivel Visible'][dia] = chequeo.nivelVisible;
                this.matrizChequeos['Ciclo Encendido'][dia] = chequeo.cicloEncendido;
                this.matrizChequeos['Bomba Alimentación'][dia] = chequeo.bombaAlimentacion;
                this.matrizChequeos['Sin Fugas'][dia] = chequeo.sinFugas;
                this.matrizChequeos['Sin Alarmas'][dia] = chequeo.sinAlarmas;
                this.matrizChequeos['Purga Fondo'][dia] = chequeo.purgaFondo;
                this.matrizChequeos['Purga Columna'][dia] = chequeo.purgaColumna;
                this.matrizChequeos['Purga Control'][dia] = chequeo.purgaControl;
                this.matrizChequeos['Nivel Tanque'][dia] = chequeo.nivelTanqueCondensado;
                this.matrizChequeos['Sist. Tratamiento'][dia] = chequeo.sistemaTratamiento;
            }
            else if (this.tipoEquipoStr === 'TRANSFERENCIAS') {
                this.matrizChequeos['Selector Auto'][dia] = chequeo.selectorAuto;
                this.matrizChequeos['Red Normal'][dia] = chequeo.redNormal;
                this.matrizChequeos['Sin Alarmas'][dia] = chequeo.sinAlarmas;
                this.matrizChequeos['Breakers Posición'][dia] = chequeo.breakersPosicion;
                this.matrizChequeos['Voltaje'][dia] = chequeo.voltaje;
            }
            else if (this.tipoEquipoStr === 'TRANSFORMADORES') {
                this.matrizChequeos['Voltaje F-F'][dia] = chequeo.voltajeFF;
                this.matrizChequeos['Voltaje F-N'][dia] = chequeo.voltajeFN;
                this.matrizChequeos['Sin Alarmas'][dia] = chequeo.sinAlarmas;
                this.matrizChequeos['Energizado'][dia] = chequeo.energizado;
                this.matrizChequeos['Sin Sobrecalentamiento'][dia] = chequeo.sinSobrecalentamiento;
            }
            else if (this.tipoEquipoStr === 'BOMBAS_AGUA') {
                this.matrizChequeos['Sist. Energizado'][dia] = chequeo.sistemaEnergizado;
                this.matrizChequeos['Modo Auto'][dia] = chequeo.modoAuto;
                this.matrizChequeos['Sin Alarmas'][dia] = chequeo.sinAlarmas;
                this.matrizChequeos['Alternancia'][dia] = chequeo.alternancia;
                this.matrizChequeos['Nivel Tanque'][dia] = chequeo.nivelTanque;
                this.matrizChequeos['Firma B1'][dia] = chequeo.firmaBomba1;
                this.matrizChequeos['Firma B2'][dia] = chequeo.firmaBomba2;
                this.matrizChequeos['Firma B3'][dia] = chequeo.firmaBomba3;
                this.matrizChequeos['Firma B.Inc'][dia] = chequeo.firmaBombaIncendios;
            }
        }
    }

    regresar() {
        this.router.navigate(['/industriales/chequeos/diarios'], { queryParams: { equipo: this.tipoEquipoStr } });
    }

    descargarPDF() {
        this.chequeosService.descargarPdfChecklist(
            this.tipoEquipoStr,
            this.equipoId,
            this.anioActual,
            this.mesActual
        );
    }
}
