import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AreasService } from '../../../../Services/appServices/areasFisicas/areas.service';
import { InspeccionService } from '../../../../Services/appServices/areasFisicas/inspeccion.service';
import { ReporteMantenimientoService } from '../../../../Services/appServices/areasFisicas/reporte-mantenimiento.service';
import { PlanMantenimientoService } from '../../../../Services/appServices/areasFisicas/plan-mantenimiento.service';
import { AreaElementoService } from '../../../../Services/appServices/areasFisicas/area-elemento.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { MantenimientoadminnavbarComponent } from '../../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import { TimelineModule } from 'primeng/timeline';
import { MesaService } from '../../../../Services/mesa-servicios/mesa.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-area-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    TableModule,
    DividerModule,
    TimelineModule,
    MantenimientoadminnavbarComponent
  ],
  templateUrl: './area-detail.component.html',
  styleUrls: ['./area-detail.component.css']
})
export class AreaDetailComponent implements OnInit {
  areaId!: number;
  areaInfo: any;
  inspecciones: any[] = [];
  reportes: any[] = [];
  planes: any[] = [];
  historial: any[] = [];
  elementosArea: any[] = [];
  isLoading = true;
  isIframe: boolean = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private areasService = inject(AreasService);
  private inspeccionService = inject(InspeccionService);
  private reporteService = inject(ReporteMantenimientoService);
  private planService = inject(PlanMantenimientoService);
  private areaElementoService = inject(AreaElementoService);
  private mesaService = inject(MesaService);

  async ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.areaId = this.route.snapshot.params['id'];
    if (this.areaId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      this.areaInfo = await this.areasService.getAreaById(this.areaId);

      const allInspecciones: any[] = await this.inspeccionService.getAllInspecciones();
      const filteredInspecciones = allInspecciones.filter((insp: any) => (insp.areaElemento?.areaIdFk == this.areaId || insp.areaElemento?.areas?.id == this.areaId));

      const gruposMap = new Map();
      filteredInspecciones.forEach((insp: any) => {
        const fechaStr = insp.fecha ? new Date(insp.fecha).toISOString().split('T')[0] : 'SinFecha';
        const uId = insp.usuario?.id || insp.usuarioIdFk || 'User';
        const key = `${fechaStr}_${uId}`;
        if (!gruposMap.has(key)) {
          gruposMap.set(key, insp);
        }
      });
      this.inspecciones = Array.from(gruposMap.values()).sort((a: any, b: any) => {
        return new Date(b.fecha ? b.fecha : 0).getTime() - new Date(a.fecha ? a.fecha : 0).getTime();
      });

      const allReportes: any[] = await this.reporteService.getAllReportes();
      const reportesF17 = allReportes.filter((rep: any) => (rep.areaElemento?.areaIdFk == this.areaId || rep.areaElemento?.areas?.id == this.areaId));
      
      // CARGAR CASOS DE MESA DE SERVICIOS
      let reportesMesa: any[] = [];
      try {
        const casos = (await firstValueFrom(this.mesaService.getCasos({ areaId: this.areaId, estado: 'CERRADO' }))) as any[];
        if (casos) {
          reportesMesa = casos.map((c: any) => ({
            id: c.id,
            fecha: c.fechaCierre || c.fechaCreacion,
            tipoMantenimiento: 'Correctivo (Mesa)',
            tipoReporte: 'Mesa de Servicios',
            realizadoPor: c.asignaciones?.length > 0 ? c.asignaciones[0].usuario?.nombres : 'Resolutor',
            isMesa: true,
            original: c
          }));
        }
      } catch (e) {
        console.warn("Error cargando casos de mesa para el área", e);
      }
      this.reportes = [...reportesF17, ...reportesMesa].sort((a: any, b: any) => {
        const dateA = new Date(a.fecha || 0).getTime();
        const dateB = new Date(b.fecha || 0).getTime();
        return dateB - dateA;
      });

      const allPlanes: any[] = await this.planService.getPlanesByArea(this.areaId);
      this.planes = allPlanes;

      try {
        const asignaciones = await this.areaElementoService.getAllAsignaciones();
        const elems = asignaciones.filter((a: any) => a.areaIdFk == this.areaId);
        this.elementosArea = elems.map((el: any) => {
          const hasFallas = this.reportes.some(r => r.areaElemento?.id === el.id);
          return {
            ...el,
            historialFallas: hasFallas
          };
        });
      } catch (e) {
        console.warn("No se pudieron cargar asignaciones", e);
      }

      this.buildHistorial();
    } catch (error) {
      console.error('Error fetching area details:', error);
    } finally {
      this.isLoading = false;
    }
  }

  buildHistorial() {
    let timeline: any[] = [];
    this.inspecciones.forEach(i => {
      const fecha = i.fecha ? new Date(i.fecha) : new Date();
      const inspector = `${i.usuario?.nombres || ''} ${i.usuario?.apellidos || ''}`.trim() || 'Usuario';
      timeline.push({
        status: 'Inspección',
        date: fecha,
        color: '#607D8B',
        icon: 'pi pi-check-square',
        description: `Inspección completada por ${inspector}`,
        id: i.id,
        eventRef: i
      });
      // Fix assignment details to arrays as well for top lists:
      i._f = fecha;
      i._inspector = inspector;
    });
    this.reportes.forEach(r => {
      const isMesa = r.isMesa;
      const isPreventive = r.tipoMantenimiento === 'Preventivo';
      const fecha = r.fecha ? new Date(r.fecha) : new Date();
      timeline.push({
        status: isMesa ? 'Caso Mesa de Servicios' : (isPreventive ? 'Mantenimiento Preventivo' : 'Mantenimiento Correctivo'),
        date: fecha,
        color: isMesa ? '#3B82F6' : (isPreventive ? '#10b981' : '#F57C00'),
        icon: isMesa ? 'pi pi-ticket' : 'pi pi-wrench',
        description: isMesa ? `Caso #${r.id}: ${r.original?.titulo || 'Cierre de mantenimiento'}` : `Reporte de tipo ${r.tipoReporte} realizado por ${r.realizadoPor || 'Técnico'}`,
        id: r.id,
        eventRef: r
      });
      r._f = fecha;
      r._isPrev = isPreventive;
    });

    this.historial = timeline.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }

  verInspeccion(planMantenimientoId: number | null) {
    if (planMantenimientoId) {
      this.router.navigate(['/areas/inspecciones/crear'], {
        queryParams: {
          planMantenimientoId: planMantenimientoId,
          areaId: this.areaId,
          mode: 'view',
          returnUrl: `/areas/detalle/${this.areaId}`
        }
      });
    } else {
      import('sweetalert2').then(Swal => {
        Swal.default.fire('Información', 'Esta inspección no está vinculada a un plan, no se puede ver el detalle completo.', 'info');
      });
    }
  }

  verReporte(item: any) {
    if (item.isMesa) {
      this.router.navigate(['/mesa/casos', item.id], {
        queryParams: { returnUrl: `/areas/detalle/${this.areaId}` }
      });
    } else {
      this.router.navigate(['/areas/reportes/mantenimiento/editar', item.id], {
        queryParams: { returnUrl: `/areas/detalle/${this.areaId}` }
      });
    }
  }

  goBack() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    const serviceId = this.areaInfo?.servicioIdFk || this.areaInfo?.servicios?.id || this.areaInfo?.servicioId;
    if (serviceId) {
      this.router.navigate(['/adminmantenimiento/areas-por-servicio', serviceId]);
    } else {
      this.router.navigate(['/adminmantenimiento/gestion-operativa']);
    }
  }
}
