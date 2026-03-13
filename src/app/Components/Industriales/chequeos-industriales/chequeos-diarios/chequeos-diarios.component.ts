import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../../constantes';
import { ChequeosIndustrialesService } from '../../../../Services/chequeos-industriales.service';
import { forkJoin, map, switchMap, of, Observable } from 'rxjs';

@Component({
    selector: 'app-chequeos-diarios',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chequeos-diarios.component.html',
    styleUrls: ['./chequeos-diarios.component.css']
})
export class ChequeosDiariosComponent implements OnInit {
    router = inject(Router);
    route = inject(ActivatedRoute);
    http = inject(HttpClient);
    chequeosService = inject(ChequeosIndustrialesService);

    tipoEquipoStr: string = '';
    equipos: any[] = [];
    cargando: boolean = true;
    configDinamico: any = null; // for dynamic (non-hardcoded) chequeo types

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tipoEquipoStr = params['equipo'] || '';
            if (this.tipoEquipoStr) {
                this.cargarEquipos();
            } else {
                this.cargando = false;
            }
        });
    }

    cargarEquipos() {
        this.cargando = true;
        this.configDinamico = null;

        // 1. Obtener todos los tipos de equipo
        this.chequeosService.obtenerTiposEquipo().pipe(
            switchMap(tipos => {
                let busqueda = this.tipoEquipoStr.replace(/_/g, ' ').toUpperCase();
                if (busqueda === 'BOMBAS AGUA') busqueda = 'BOMBAS DE AGUA';

                const tipoEncontrado = tipos.find((t: any) => t.nombres.toUpperCase().includes(busqueda));

                if (!tipoEncontrado) {
                    // 2. Fallback: lookup via ConfiguracionChequeoTipo by identificadorString
                    return this.chequeosService.obtenerConfigPorIdentificador(this.tipoEquipoStr).pipe(
                        switchMap((cfg: any) => {
                            if (!cfg || !cfg.tipoEquipoIdFk) return of([]);
                            this.configDinamico = cfg;
                            return this.chequeosService.obtenerEquiposPorTipo(cfg.tipoEquipoIdFk);
                        })
                    );
                }

                return this.chequeosService.obtenerEquiposPorTipo(tipoEncontrado.id);
            }),
            switchMap(equipos => {
                if (!equipos || equipos.length === 0) return of([]);

                // For dynamic types, skip the daily check state (always show as not reviewed)
                if (this.configDinamico) {
                    return of(equipos.map((eq: any) => ({ ...eq, revisadoHoy: false, esDinamico: true })));
                }

                // 3. For hardcoded types, check if reviewed today
                const estadoRequests: Observable<any>[] = equipos.map((eq: any) =>
                    this.chequeosService.obtenerEstadoDiario(this.tipoEquipoStr, eq.id).pipe(
                        map((res: { existe: boolean }) => ({ ...eq, revisadoHoy: res.existe }))
                    )
                );
                return forkJoin(estadoRequests);
            })
        ).subscribe({
            next: (equiposConEstado) => {
                this.equipos = equiposConEstado;
                this.cargando = false;
            },
            error: (err) => {
                console.error('Error cargando equipos:', err);
                this.cargando = false;
            }
        });
    }

    accionEquipo(equipo: any) {
        if (equipo.esDinamico && this.configDinamico) {
            // Dynamic type: go to a generic chequeo form
            this.router.navigate(['/industriales/chequeos/diarios/formulario'], {
                queryParams: { tipo: this.tipoEquipoStr, equipoId: equipo.id, nombre: equipo.nombres, configId: this.configDinamico.id }
            });
        } else if (equipo.revisadoHoy) {
            this.router.navigate(['/industriales/chequeos/diarios/consolidado'], {
                queryParams: { tipo: this.tipoEquipoStr, equipoId: equipo.id, nombre: equipo.nombres }
            });
        } else {
            this.router.navigate(['/industriales/chequeos/diarios/formulario'], {
                queryParams: { tipo: this.tipoEquipoStr, equipoId: equipo.id, nombre: equipo.nombres }
            });
        }
    }

    regresar() {
        this.router.navigate(['/industriales/chequeos']);
    }
}
