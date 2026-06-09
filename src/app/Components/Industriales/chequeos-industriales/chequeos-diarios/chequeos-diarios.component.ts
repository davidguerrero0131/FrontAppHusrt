import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ChequeosIndustrialesService } from '../../../../Services/chequeos-industriales.service';
import { forkJoin, map, switchMap, of, Observable } from 'rxjs';
import { IndustrialesNavbarComponent } from '../../../navbars/IndustrialesNavbar/industrialesnavbar.component';

@Component({
    selector: 'app-chequeos-diarios',
    standalone: true,
    imports: [CommonModule, IndustrialesNavbarComponent],
    templateUrl: './chequeos-diarios.component.html',
    styleUrls: ['./chequeos-diarios.component.css']
})
export class ChequeosDiariosComponent implements OnInit {
    router = inject(Router);
    route = inject(ActivatedRoute);
    chequeosService = inject(ChequeosIndustrialesService);

    tipoEquipoStr: string = '';
    tipoId: number | null = null;
    equipos: any[] = [];
    cargando: boolean = true;
    configDinamico: any = null; // for dynamic (non-hardcoded) chequeo types

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.tipoEquipoStr = params['equipo'] || '';
            this.tipoId = params['tipoId'] ? parseInt(params['tipoId']) : null;
            if (this.tipoEquipoStr || this.tipoId) {
                this.cargarEquipos();
            } else {
                this.cargando = false;
            }
        });
    }

    cargarEquipos() {
        this.cargando = true;
        this.configDinamico = null;

        // 0. Si tenemos el ID exacto, usarlo directamente
        if (this.tipoId) {
            // Cargar primero la configuración para saber si es un tipo dinámico
            this.chequeosService.obtenerConfigByTipo(this.tipoId).pipe(
                switchMap(config => {
                    this.configDinamico = config;
                    return this.chequeosService.obtenerEquiposPorTipo(this.tipoId!);
                }),
                switchMap(equipos => this.procesarEquiposConEstado(equipos))
            ).subscribe({
                next: (equiposConEstado) => {
                    this.equipos = equiposConEstado;
                    this.cargando = false;
                },
                error: (err) => {
                    // Si falla la config, intentar cargar equipos de todos modos (fallback)
                    this.chequeosService.obtenerEquiposPorTipo(this.tipoId!).pipe(
                        switchMap(equipos => this.procesarEquiposConEstado(equipos))
                    ).subscribe({
                        next: (equipos) => { this.equipos = equipos; this.cargando = false; },
                        error: () => this.cargando = false
                    });
                }
            });
            return;
        }

        // 1. Fallback: búsqueda por texto (conservado para compatibilidad)
        this.chequeosService.obtenerTiposEquipo().pipe(
            switchMap(tipos => {
                const searchStr = this.tipoEquipoStr.toUpperCase();
                const manualMap: { [key: string]: string } = {
                    'PLANTAS_ELECTRICAS': 'PLANTA ELECTRICA',
                    'BOMBAS_AGUA': 'BOMBA',
                    'CALDERAS': 'CALDERA',
                    'TRANSFORMADORES': 'TRANSFORMADOR',
                    'TRANSFERENCIAS': 'TRANSFERENCIA',
                    'UPS': 'UPS'
                };
                const mappedSearch = manualMap[searchStr] || searchStr.replace(/_/g, ' ');
                const tipoEncontrado = tipos.find((t: any) => {
                    const dbName = t.nombres.toUpperCase();
                    // Búsqueda flexible: exacta, contiene o contenido en
                    return dbName === mappedSearch || dbName.includes(mappedSearch) || mappedSearch.includes(dbName);
                });

                if (!tipoEncontrado) {
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
            switchMap(equipos => this.procesarEquiposConEstado(equipos))
        ).subscribe({
            next: (equiposConEstado) => {
                this.equipos = equiposConEstado;
                this.cargando = false;
            },
            error: (err) => {
                console.error('Error cargando equipos por texto:', err);
                this.cargando = false;
            }
        });
    }

    private procesarEquiposConEstado(equipos: any[]): Observable<any[]> {
        if (!equipos || equipos.length === 0) return of([]);

        // Si es un tipo dinámico, cargamos su config para saber si usamos el formulario genérico
        if (this.configDinamico) {
            return of(equipos.map((eq: any) => ({ ...eq, revisadoHoy: false, esDinamico: true })));
        }

        // Para los tipos "estándar", verificar si ya fueron revisados hoy
        const estadoRequests: Observable<any>[] = equipos.map((eq: any) =>
            this.chequeosService.obtenerEstadoDiario(this.tipoEquipoStr, eq.id).pipe(
                map((res: { existe: boolean }) => ({ ...eq, revisadoHoy: res.existe }))
            )
        );
        return forkJoin(estadoRequests);
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

    verConsolidado(equipo: any) {
        this.router.navigate(['/industriales/chequeos/diarios/consolidado'], {
            queryParams: { tipo: this.tipoEquipoStr, equipoId: equipo.id, nombre: equipo.nombres }
        });
    }

    regresar() {
    window.history.back();
  }
}
