
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquiposService } from '../../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { FormsModule } from '@angular/forms';
import { BiomedicausernavbarComponent } from '../../navbars/biomedicausernavbar/biomedicausernavbar.component';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-home-invitado',
    standalone: true,
    imports: [FormsModule, CommonModule, SelectModule],
    templateUrl: './home-invitado.component.html',
    styleUrl: './home-invitado.component.css'
})
export class HomeInvitadoComponent implements OnInit {

    equipos!: any[];
    selectedEquipo: any | undefined;
    equipoServices = inject(EquiposService);

    constructor(private router: Router) {
    }

    async ngOnInit() {
        this.equipos = await this.equipoServices.getAllEquiposSeries();
    }

    buscarEquipo() {
        console.log(this.selectedEquipo);
        if (this.selectedEquipo) {
            this.router.navigate(['/biomedica/reportesequipo/' + this.selectedEquipo.id]);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Seleccione un equipo',
                text: 'Debe seleccionar un Equipo.'
            })
        }
    }

    showViewTiposEquipoBio() {
        this.router.navigate(['/biomedica/tiposequipo']);
    }

    showViewServicios() {
        this.router.navigate(['/biomedica/servicios']);
    }

    showViewEmpComodatos() {
        this.router.navigate(['biomedica/empComodatos']);
    }

    showViewResponsables() {
        this.router.navigate(['biomedica/responsables']);
    }

    showViewSedes() {
        this.router.navigate(['biomedica/sedes']);
    }
}
