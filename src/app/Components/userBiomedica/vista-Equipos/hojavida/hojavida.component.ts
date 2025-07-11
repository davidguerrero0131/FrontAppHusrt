import { HojavidaService } from './../../../../Services/appServices/biomedicaServices/hojavida/hojavida.service';
import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BiomedicausernavbarComponent } from '../../../navbars/biomedicausernavbar/biomedicausernavbar.component';

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
  hojaVida: any;
  hojavidaService = inject(HojavidaService);

  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.hojaVida = await this.hojavidaService.getHojaVidaByIdEquipo(this.id);
    console.log(this.hojaVida);
  }

  datosTecnicosKeys(): string[] {
  return this.hojaVida?.datosTecnicos
    ? Object.keys(this.hojaVida.datosTecnicos).filter(k => !['id', 'createdAt', 'updatedAt'].includes(k))
    : [];
}
}


