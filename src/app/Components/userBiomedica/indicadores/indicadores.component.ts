
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { ReportesService } from '../../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { IndicadoresService } from '../../../Services/appServices/biomedicaServices/indicadores/indicadores.service';
import { MeterGroupModule } from 'primeng/metergroup';
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';

type TipoMantenimiento = 'Correctivo' | 'Preventivo' | 'Predictivo' | 'Otro';
type TipoFalla =
  | 'Desgaste'
  | 'Operación Indebida'
  | 'Causa Externa'
  | 'Accesorios'
  | 'Desconocido'
  | 'Sin Falla'
  | 'Otros'
  | 'No Registra';

interface IEquipo { id: number; nombres?: string; nombre?: string; codigo?: string; }
interface IServicio { id: number; nombre: string; }
interface IUsuario { id: number; nombres?: string; apellidos?: string; nombre?: string; email?: string; }
interface Reporte {
  id: number;
  fechaRealizado: string | null;
  horaTotal?: string | null;
  tipoMantenimiento?: TipoMantenimiento | null;
  tipoFalla?: TipoFalla | null;
  realizado?: boolean | null;
  servicioIdFk: number;
  equipoIdFk: number;
  usuarioIdFk: number | null;
  equipo?: IEquipo | null;
  servicio?: IServicio | null;
  usuario?: IUsuario | null;
}

@Component({
  selector: 'app-indicadores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    ProgressSpinnerModule,
    TagModule,
    MeterGroupModule
  ],
  templateUrl: `./indicadores.component.html`,
})
export class IndicadoresComponent {


  private srv = inject(ReportesService);
  private indicadoresSrv = inject(IndicadoresService);

  loading = signal(false);
  reportes = signal<Reporte[]>([]);
  indicadoresData = signal<any>(null);

  // Fecha única (Mes/Año)
  selectedMonth = signal<Date | null>(new Date());

  totalReportesLabel = computed(() => `Total: ${this.reportes().length}`);

  constructor() { this.refrescar(); }

  async refrescar() {
    const mes = this.selectedMonth();
    if (!mes) return;

    // Calcular Start y End del mes seleccionado
    const year = mes.getFullYear();
    const month = mes.getMonth(); // 0-11

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0); // Último día del mes

    const inicioStr = this.yyyyMMdd(firstDay);
    const finStr = this.yyyyMMdd(lastDay);

    this.loading.set(true);
    try {
      const data = await this.srv.getReportesPorRango(inicioStr, finStr, 2000, 0);
      this.reportes.set(Array.isArray(data) ? data : []);

      const ind = await this.indicadoresSrv.getIndicadoresCumplimiento(inicioStr, finStr);
      this.indicadoresData.set(ind);
    } catch (e) {
      console.error(e);
      this.reportes.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private groupCount<K extends string | number>(arr: Reporte[], key: (r: Reporte) => K | null | undefined) {
    const m = new Map<K, number>();
    for (const r of arr) {
      const k = key(r);
      if (k == null) continue;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  }
  private groupAvg<K extends string | number>(arr: Reporte[], key: (r: Reporte) => K | null | undefined, val: (r: Reporte) => number | null) {
    const sum = new Map<K, number>(), cnt = new Map<K, number>(), avg = new Map<K, number>();
    for (const r of arr) {
      const k = key(r); const v = val(r);
      if (k == null || v == null) continue;
      sum.set(k, (sum.get(k) ?? 0) + v);
      cnt.set(k, (cnt.get(k) ?? 0) + 1);
    }
    for (const [k, s] of sum.entries()) avg.set(k, s / (cnt.get(k) ?? 1));
    return avg;
  }

  chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 14 } } },
      tooltip: { mode: 'index', intersect: false }
    }
  }) as any);

  barOptions(title?: string) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 14 } } },
        title: title ? { display: true, text: title, font: { size: 18 } } : undefined,
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { ticks: { autoSkip: true, font: { size: 12 } } },
        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 12 } } }
      }
    } as any;
  }
  lineOptions(title?: string) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 14 } } },
        title: title ? { display: true, text: title, font: { size: 18 } } : undefined,
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { ticks: { autoSkip: true, font: { size: 12 } } },
        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 12 } } }
      }
    } as any;
  }

  // --- Nuevos Computed para Indicadores Backend ---

  preventivoMeterData = computed(() => {
    const d = this.indicadoresData();
    if (!d || !d.preventivo) return [];
    const c = d.preventivo.cumplimiento || 0;
    return [
      { label: 'Realizados', value: c, color: '#34d399', icon: 'pi pi-check-circle' },
      { label: 'Pendientes', value: 100 - c, color: '#fbbf24', icon: 'pi pi-exclamation-circle' }
    ];
  });

  correctivoMeterData = computed(() => {
    const d = this.indicadoresData();
    if (!d || !d.correctivo) return [];
    const c = d.correctivo.cumplimiento || 0;
    return [
      { label: 'Atendidos', value: c, color: '#60a5fa', icon: 'pi pi-check-circle' },
      { label: 'Pendientes', value: 100 - c, color: '#f87171', icon: 'pi pi-exclamation-circle' }
    ];
  });

  duracionStats = computed(() => {
    const d = this.indicadoresData();
    if (!d) return { preventivo: '00:00:00', correctivo: '00:00:00' };
    return {
      preventivo: d.preventivo?.promedioDuracion || '00:00:00',
      correctivo: d.correctivo?.promedioDuracion || '00:00:00'
    };
  });

  preventivoInfo = computed(() => {
    const d = this.indicadoresData();
    return d?.preventivo || { programados: 0, realizados: 0, cumplimiento: 0 };
  });

  correctivoInfo = computed(() => {
    const d = this.indicadoresData();
    return d?.correctivo || { reportados: 0, realizados: 0, cumplimiento: 0 };
  });

  realizadosChartData = computed(() => {
    const rs = this.reportes();
    const hechos = rs.filter(r => r.realizado === true).length;
    const no = rs.length - hechos;
    return { labels: ['Realizados', 'No realizados'], datasets: [{ data: [hechos, no] }] };
  });

  porTipoChartData = computed(() => {
    const rs = this.reportes();
    const orden: TipoMantenimiento[] = ['Preventivo', 'Correctivo', 'Predictivo', 'Otro'];
    const mapa = this.groupCount(rs, r => (r.tipoMantenimiento ?? 'Otro') as TipoMantenimiento);
    return { labels: orden, datasets: [{ label: 'Cantidad', data: orden.map(k => mapa.get(k) ?? 0) }] };
  });

  porUsuarioChartData = computed(() => {
    const rs = this.reportes();
    const mapa = this.groupCount(rs, r => {
      const u = r.usuario;
      const nom = (u?.nombres || u?.nombre || '').trim();
      const ap = (u?.apellidos || '').trim();
      const email = (u?.email || '').trim();
      return (nom || ap) ? `${nom} ${ap}`.trim() : (email || 'Sin usuario');
    });
    const labels = Array.from(mapa.keys());
    const data = labels.map(l => mapa.get(l) ?? 0);
    return { labels, datasets: [{ label: 'Reportes', data }] };
  });

  porServicioChartData = computed(() => {
    const rs = this.reportes();
    const mapa = this.groupCount(rs, r => r.servicio?.nombre || 'Sin servicio');
    const labels = Array.from(mapa.keys());
    const data = labels.map(l => mapa.get(l) ?? 0);
    return { labels, datasets: [{ label: 'Reportes', data }] };
  });

  porFallaChartData = computed(() => {
    const rs = this.reportes();
    const orden: TipoFalla[] = [
      'Desgaste', 'Operación Indebida', 'Causa Externa', 'Accesorios',
      'Desconocido', 'Sin Falla', 'Otros', 'No Registra'
    ];
    const mapa = this.groupCount(rs, r => (r.tipoFalla ?? 'No Registra') as TipoFalla);
    return { labels: orden, datasets: [{ label: 'Reportes', data: orden.map(k => mapa.get(k) ?? 0) }] };
  });

  porMesChartData = computed(() => {
    const rs = this.reportes();
    const m = new Map<string, number>(); // YYYY-MM
    for (const r of rs) {
      if (!r.fechaRealizado) continue;
      const ym = r.fechaRealizado.slice(0, 7);
      m.set(ym, (m.get(ym) ?? 0) + 1);
    }
    const labels = Array.from(m.keys()).sort();
    const data = labels.map(l => m.get(l) ?? 0);
    return { labels, datasets: [{ label: 'Reportes', data, tension: 0.3, fill: false }] };
  });

  topEquiposChartData = computed(() => {
    const rs = this.reportes();
    const mapa = this.groupCount(rs, r => r.equipo?.nombres || r.equipo?.nombre || r.equipo?.codigo || `Equipo ${r.equipoIdFk}`);
    const pares = Array.from(mapa.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const labels = pares.map(p => p[0] as string);
    const data = pares.map(p => p[1]);
    return { labels, datasets: [{ label: 'Reportes', data }] };
  });

  duracionPromedioPorTipoChartData = computed(() => {
    const rs = this.reportes();
    const avg = this.groupAvg(
      rs,
      r => (r.tipoMantenimiento ?? 'Otro') as TipoMantenimiento,
      r => this.hhmmssToMinutes(r.horaTotal)
    );
    const orden: TipoMantenimiento[] = ['Preventivo', 'Correctivo', 'Predictivo', 'Otro'];
    const labels = orden;
    const data = orden.map(k => Math.round((avg.get(k) ?? 0) * 10) / 10);
    return { labels, datasets: [{ label: 'Minutos (prom.)', data }] };
  });


  private mesActual(): [Date, Date] {
    const now = new Date();
    return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)];
    // (el día fin es el último del mes; el backend interpreta inclusivo)
  }
  private yyyyMMdd(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private hhmmssToMinutes(v?: string | null): number | null {
    if (!v) return null;
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v);
    if (!m) return null;
    const h = +m[1], min = +m[2], s = +(m[3] ?? 0);
    return h * 60 + min + s / 60;
  }



}
