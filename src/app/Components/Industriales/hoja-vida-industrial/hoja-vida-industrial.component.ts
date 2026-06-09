import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { MantenimientoadminnavbarComponent } from '../../navbars/mantenimientoadminnavbar/mantenimientoadminnavbar.component';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import { EquiposIndustrialesService } from '../../../Services/appServices/industrialesServices/equipos/equiposIndustriales.service';
import { HojaDeVidaIndustrialService } from '../../../Services/appServices/industrialesServices/HojaDeVida/HojaDeVidaIndustrial.service';
import { MesaService } from '../../../Services/mesa-servicios/mesa.service';
import { ReporteIndustrialService } from '../../../Services/appServices/industrialesServices/reportes/reporte-industrial.service';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constantes';

@Component({
  selector: 'app-hoja-vida-industrial',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    DividerModule,
    MantenimientoadminnavbarComponent,
    TimelineModule
  ],
  templateUrl: './hoja-vida-industrial.component.html',
  styleUrls: []
})
export class HojaVidaIndustrialComponent implements OnInit {

  protected readonly API_URL = API_URL;

  equipoId!: number;
  hvEquipoInfo: any = null;
  hvHojaVida: any = null;
  hvDatosTecnicos: any = null;
  hvProveedor: any = null;
  hvRegistroApoyo: any = null;
  hvDocumentos: any[] = [];
  hvReportes: any[] = [];
  hvHistorial: any[] = [];
  loadingHojaVida: boolean = true;
  hvUploading: boolean = false;
  userRole: string = '';
  isIframe: boolean = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private equiposService = inject(EquiposIndustrialesService);
  private hojaVidaService = inject(HojaDeVidaIndustrialService);
  private mesaService = inject(MesaService);
  private reporteService = inject(ReporteIndustrialService);

  async ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.loadUserRole();
    this.equipoId = Number(this.route.snapshot.params['id']);
    if (this.equipoId) {
      await this.loadHojaDeVida(this.equipoId);
    } else {
        Swal.fire('Error', 'ID de equipo no proporcionado', 'error');
        this.goBack();
    }
  }

  async loadHojaDeVida(idEquipo: number) {
    this.loadingHojaVida = true;
    try {
      this.hvEquipoInfo = await this.equiposService.getEquipoById(idEquipo);

      const results = await Promise.allSettled([
        this.hojaVidaService.getHojaVidaByEquipo(idEquipo),
        this.hojaVidaService.getDatosTecnicosByEquipo(idEquipo),
        this.hojaVidaService.getProveedorByEquipo(idEquipo),
        this.hojaVidaService.getRegistroApoyoByEquipo(idEquipo)
      ]) as any[];

      if (results[0].status === 'fulfilled') this.hvHojaVida = results[0].value;
      if (results[1].status === 'fulfilled') this.hvDatosTecnicos = results[1].value;
      if (results[2].status === 'fulfilled') this.hvProveedor = results[2].value;
      if (results[3].status === 'fulfilled') this.hvRegistroApoyo = results[3].value;

      try {
        this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(idEquipo);
      } catch (e) {
        console.error('Error cargando documentos:', e);
      }

      // CARGAR HISTORIAL DE MANTENIMIENTOS
      try {
        const reportesF17 = (await this.reporteService.getReportesEquipo(idEquipo)) as any[];
        
        let reportesMesa: any[] = [];
        try {
          const casos = (await firstValueFrom(this.mesaService.getCasos({ equipoId: idEquipo, estado: 'CERRADO' }))) as any[];
          if (casos) {
            reportesMesa = casos.map((c: any) => ({
              id: c.id,
              fecha: c.fechaCierre || c.fechaCreacion,
              tipoMantenimiento: 'Correctivo (Mesa)',
              realizadoPor: c.asignaciones?.length > 0 ? c.asignaciones[0].usuario?.nombres : 'Resolutor',
              isMesa: true,
              original: c
            }));
          }
        } catch (e) { console.warn("Error mesa", e); }

        this.hvReportes = [...reportesF17, ...reportesMesa].sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.buildHistorial();
      } catch (e) {
        console.error('Error cargando historial:', e);
      }
    } catch (error) {
      console.error('Error al cargar hoja de vida:', error);
      Swal.fire('Error', 'No se pudo cargar la hoja de vida del equipo', 'error');
    } finally {
      this.loadingHojaVida = false;
    }
  }

  async hvOnFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire('Error', 'El archivo supera el límite de 10MB', 'error');
        return;
      }
      try {
        this.hvUploading = true;
        await this.hojaVidaService.uploadDocument(this.hvEquipoInfo.id, file);
        Swal.fire('Éxito', 'Documento subido correctamente', 'success');
        this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(this.hvEquipoInfo.id);
      } catch (error) {
        console.error('Error subiendo documento:', error);
        Swal.fire('Error', 'No se pudo subir el documento', 'error');
      } finally {
        this.hvUploading = false;
        event.target.value = '';
      }
    }
  }

  async hvEliminarDocumento(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.hojaVidaService.deleteDocument(id);
          Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
          this.hvDocumentos = await this.hojaVidaService.getDocumentsByEquipo(this.hvEquipoInfo.id);
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el documento', 'error');
        }
      }
    });
  }

  hvDescargarDocumento(id: number, filename: string) {
    this.hojaVidaService.downloadDocument(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error al descargar documento:', error);
        Swal.fire('Error', 'No se pudo descargar el documento', 'error');
      }
    });
  }

  hvVisualizarDocumento(id: number) {
    this.hojaVidaService.downloadDocument(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error: any) => {
        console.error('Error al visualizar documento:', error);
        Swal.fire('Error', 'No se pudo visualizar el documento', 'error');
      }
    });
  }

  descargarHojaVidaPdf() {
    if (!this.hvEquipoInfo) {
      Swal.fire('Error', 'No se ha seleccionado ningún equipo.', 'error');
      return;
    }

    this.hojaVidaService.downloadHojaVidaPdf(this.hvEquipoInfo.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Hoja_de_Vida_${this.hvEquipoInfo.placa || this.hvEquipoInfo.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error al descargar PDF:', error);
        Swal.fire('Error', 'No se pudo generar el PDF de la hoja de vida.', 'error');
      }
    });
  }

  getImageUrl(fotoPath: string | null | undefined): string {
    if (fotoPath) {
      const filename = fotoPath.split('\\').pop()?.split('/').pop();
      if (filename) {
        return `${this.API_URL}/uploads/industriales/Hoja De Vida/${filename}`;
      }
    }
    
    if (this.hvEquipoInfo && this.hvEquipoInfo.tipoEquipoInd && this.hvEquipoInfo.tipoEquipoInd.nombres) {
      const tipo = this.hvEquipoInfo.tipoEquipoInd.nombres;
      return `${this.API_URL}/imagenequipotipo/${encodeURIComponent(tipo)}`;
    }
    
    return 'https://via.placeholder.com/250x250?text=Sin+Imagen';
  }

  datosTecnicosKeys(): string[] {
    return this.hvDatosTecnicos
      ? Object.keys(this.hvDatosTecnicos).filter(k => !['id', 'equipoIndustrialIdFk', 'createdAt', 'updatedAt'].includes(k))
      : [];
  }

  crearHojaDeVida() {
    this.router.navigate(['/industriales/hoja-de-vida/crear', this.equipoId]);
  }

  buildHistorial() {
    this.hvHistorial = this.hvReportes.map(r => {
      const isMesa = r.isMesa;
      return {
        status: isMesa ? 'Caso Mesa de Servicios' : (r.tipoMantenimiento || 'Mantenimiento'),
        date: new Date(r.fecha),
        icon: isMesa ? 'pi pi-ticket' : 'pi pi-wrench',
        color: isMesa ? '#3B82F6' : (r.tipoMantenimiento === 'Preventivo' ? '#10b981' : '#F57C00'),
        description: isMesa ? `Caso #${r.id}: ${r.original?.titulo || 'Cierre de mantenimiento'}` : `Reporte #${r.id} realizado por ${r.realizadoPor || 'Técnico'}`,
        original: r
      };
    });
  }

  verDetalleHistorial(event: any) {
    const item = event.original;
    if (item.isMesa) {
      this.router.navigate(['/mesa/casos', item.id], {
        queryParams: { returnUrl: this.router.url }
      });
    } else {
      // Para reportes industriales normales
      this.router.navigate(['/industriales/reportes/detalle', item.id], {
        queryParams: { returnUrl: this.router.url }
      });
    }
  }

  goBack() {
    window.history.back();
  }

  canCreateHV(): boolean {
    const adminRoles = ['8', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO', '1', 'SUPERADMIN', '2', 'SYSTEMADMIN', 'ADMINMANTENIMIENTO'];
    return adminRoles.includes(this.userRole) || this.userRole === 'USERMANTENIMIENTO' || this.userRole === 'TECNICOMANTENIMIENTO';
  }

  canEditHV(): boolean {
    const adminRoles = ['8', 'ADMINMANTENIMIENTO', 'USERMANTENIMIENTO', '1', 'SUPERADMIN', '2', 'SYSTEMADMIN', 'ADMINMANTENIMIENTO'];
    return adminRoles.includes(this.userRole) || this.userRole === 'USERMANTENIMIENTO';
  }

  loadUserRole() {
    if (typeof sessionStorage === 'undefined') return;
    const token = sessionStorage.getItem('utoken');
    if (token) {
      const decoded: any = this.getDecodedAccessToken(token);
      this.userRole = decoded ? decoded.rol : '';

      // Normalization for Role IDs and Names
      const rawRole = String(this.userRole);

      if (rawRole === '8' || rawRole === 'ADMINMANTENIMIENTO' || rawRole === 'USERMANTENIMIENTO' || rawRole === '1' || rawRole === 'SUPERADMIN' || rawRole === '2' || rawRole === 'SYSTEMADMIN' || rawRole === 'ADMINMANTENIMIENTO' || rawRole === 'USERMANTENIMIENTO') {
        this.userRole = 'ADMINMANTENIMIENTO';
      } else if (rawRole === '9' || rawRole === 'TECNICOMANTENIMIENTO' || rawRole === '7' || rawRole === 'BIOMEDICATECNICO' || rawRole === 'TECNICOMANTENIMIENTO') {
        this.userRole = 'TECNICOMANTENIMIENTO';
      } else if (rawRole === '10' || rawRole === 'USERMANTENIMIENTO' || rawRole === '5' || rawRole === 'SYSTEMUSER' || rawRole === '6' || rawRole === 'BIOMEDICAUSER' || rawRole === 'USERMANTENIMIENTO') {
        this.userRole = 'USERMANTENIMIENTO';
      } else {
        this.userRole = rawRole;
      }
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
