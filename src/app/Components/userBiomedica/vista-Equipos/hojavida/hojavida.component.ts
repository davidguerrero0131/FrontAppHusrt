import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { HojavidaService } from './../../../../Services/appServices/biomedicaServices/hojavida/hojavida.service';
import { ImagenesService } from './../../../../Services/appServices/general/imagenes/imagenes.service'
import { MantenimientosService } from './../../../../Services/appServices/biomedicaServices/mantenimientos/mantenimientos.service';
import { MetrologiaService } from './../../../../Services/appServices/biomedicaServices/metrologia/metrologia.service'
import { obtenerNombreMes } from '../../../../utilidades';
@Component({
  selector: 'app-hojavida',
  imports: [BiomedicausernavbarComponent,
    CommonModule,
    CardModule,
    AccordionModule,
    PanelModule,
    DividerModule,
    ImageModule],
  templateUrl: './hojavida.component.html',
  styleUrl: './hojavida.component.css'

})
export class HojavidaComponent implements OnInit {

  id: string | null = null;
  imagenUrl: SafeUrl | null = null;
  hojaVida: any;
  planMantenimiento: any[] = [];
  planMetrologia: any[] = [];
  hojavidaService = inject(HojavidaService);
  imagenesServices = inject(ImagenesService);
  mantenimientosService = inject(MantenimientosService);
  metrologiaServices = inject(MetrologiaService);

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    try {
      this.id = this.route.snapshot.paramMap.get('id');
      this.hojaVida = await this.hojavidaService.getHojaVidaByIdEquipo(this.id);
      this.planMantenimiento = await this.mantenimientosService.getPlanMantenimientoEquipo(this.id);
      this.planMetrologia = await this.metrologiaServices.getPlanMetrologiaEquipo(this.id);
      console.log({ruta: this.hojaVida?.foto});
      if (this.hojaVida?.foto) {
        const blob = await this.imagenesServices.getImagen(this.hojaVida.foto);
        console.log('Tipo MIME recibido:', blob);
        const objectUrl = URL.createObjectURL(blob);
        this.imagenUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      } else {
        console.warn('No hay imagen en hoja de vida');
      }

    } catch (error) {
      console.error('Error cargando hoja de vida o imagen:', error);
    }
  }

  datosTecnicosKeys(): string[] {
    return this.hojaVida?.datosTecnicos
      ? Object.keys(this.hojaVida.datosTecnicos).filter(k => !['id', 'createdAt', 'updatedAt'].includes(k))
      : [];
  }


  async cargarImagen() {
    try {
      const blob = await this.imagenesServices.getImagen('D:/imagenes/foto1.jpg');
      const objectUrl = URL.createObjectURL(blob);
      this.imagenUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    }
  }

  getNombreMes(numeroMes: number): string {
    return obtenerNombreMes(numeroMes);
  }
}



