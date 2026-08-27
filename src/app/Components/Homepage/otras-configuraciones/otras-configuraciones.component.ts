import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ParametrosService } from '../../../Services/appServices/biomedicaServices/parametros/parametros.service';
import { UserService } from '../../../Services/appServices/userServices/user.service';
import { MesaService } from '../../../Services/mesa-servicios/mesa.service';
import Swal from 'sweetalert2';
import { getDecodedAccessToken } from '../../../utilidades';

@Component({
  selector: 'app-otras-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, DropdownModule, RouterModule],
  templateUrl: './otras-configuraciones.component.html',
  styleUrl: './otras-configuraciones.component.css'
})
export class OtrasConfiguracionesComponent implements OnInit {
    router = inject(Router);
    parametrosService = inject(ParametrosService);
    userService = inject(UserService);
    mesaService = inject(MesaService);

    isSuperAdmin: boolean = false;
    isBiomedicaAdmin: boolean = false;

    usuarios: any[] = [];
    usuarioGarantiaId: any;
    
    subcategoriasMesa: any[] = [];
    subcategoriaMantenimientoId: any;

    subcategoriasMesaSistemas: any[] = [];
    subcategoriaSistemasId: any;

    constructor() {
        this.checkRole();
    }

    ngOnInit(): void {
        this.cargarUsuarios();
        this.cargarParametroGarantia();
        this.cargarSubcategoriasMesa();
        this.cargarParametroSubcategoria();
        this.cargarSubcategoriasSistemas();
        this.cargarParametroSubcategoriaSistemas();
    }

    checkRole() {
        const token = sessionStorage.getItem('utoken');
        if (token) {
            const decoded = getDecodedAccessToken();
            if (decoded?.rol === 'SUPERADMIN') this.isSuperAdmin = true;
            if (decoded?.rol === 'BIOMEDICAADMIN') this.isBiomedicaAdmin = true;
        }
    }

    async cargarUsuarios() {
        try {
            const data = await this.userService.getAllUsers();
            this.usuarios = data.filter((u: any) => u.estado === true && u.servicioId === 3).map((u: any) => ({
                label: `${u.nombres} ${u.apellidos}${u.numIdentificacion ? ' - ' + u.numIdentificacion : ''}`,
                value: u.id
            }));
        } catch (error) {
            console.error('Error cargando usuarios', error);
        }
    }

    async cargarParametroGarantia() {
        try {
            const param = await this.parametrosService.getParametro('usuario_garantia');
            if (param && param.valor) {
                this.usuarioGarantiaId = parseInt(param.valor, 10);
            }
        } catch (error) {
            console.log('Parámetro no encontrado, usando defecto 59');
            this.usuarioGarantiaId = 59;
        }
    }

    async guardarParametroGarantia() {
        try {
            if (!this.usuarioGarantiaId) return;
            await this.parametrosService.updateParametro('usuario_garantia', this.usuarioGarantiaId.toString());
            Swal.fire('Éxito', 'Parámetro actualizado', 'success');
        } catch (error) {
            console.error('Error guardando parámetro', error);
            Swal.fire('Error', 'No se pudo guardar el parámetro', 'error');
        }
    }

    async cargarSubcategoriasMesa() {
        try {
            // Servicio Biomedica = 3
            this.mesaService.getCategorias(3, true).subscribe((categorias: any[]) => {
                const subcategorias: any[] = [];
                categorias.forEach(cat => {
                    if (cat.subcategorias) {
                        cat.subcategorias.forEach((sub: any) => {
                            subcategorias.push({
                                label: `${cat.nombre} - ${sub.nombre}`,
                                value: sub.id
                            });
                        });
                    }
                });
                this.subcategoriasMesa = subcategorias;
            });
        } catch (error) {
            console.error('Error cargando subcategorías de mesa', error);
        }
    }

    async cargarSubcategoriasSistemas() {
        try {
            // Servicio Sistemas = 45
            this.mesaService.getCategorias(45, true).subscribe((categorias: any[]) => {
                const subcategorias: any[] = [];
                categorias.forEach(cat => {
                    if (cat.subcategorias) {
                        cat.subcategorias.forEach((sub: any) => {
                            subcategorias.push({
                                label: `${cat.nombre} - ${sub.nombre}`,
                                value: sub.id
                            });
                        });
                    }
                });
                this.subcategoriasMesaSistemas = subcategorias;
            });
        } catch (error) {
            console.error('Error cargando subcategorías sistemas', error);
        }
    }

    async cargarParametroSubcategoria() {
        try {
            const param = await this.parametrosService.getParametro('subcategoria_mantenimiento_equipo');
            if (param && param.valor) {
                this.subcategoriaMantenimientoId = parseInt(param.valor, 10);
            }
        } catch (error) {
            console.log('Parámetro de subcategoría no encontrado');
        }
    }

    async guardarParametroSubcategoria() {
        try {
            if (!this.subcategoriaMantenimientoId) return;
            await this.parametrosService.updateParametro('subcategoria_mantenimiento_equipo', this.subcategoriaMantenimientoId.toString());
            Swal.fire('Éxito', 'Subcategoría para mantenimientos actualizada', 'success');
        } catch (error) {
            console.error('Error guardando parámetro de subcategoría', error);
            Swal.fire('Error', 'No se pudo guardar la subcategoría', 'error');
        }
    }

    async cargarParametroSubcategoriaSistemas() {
        try {
            const param = await this.parametrosService.getParametro('subcategoria_mantenimiento_sistemas');
            if (param && param.valor) {
                this.subcategoriaSistemasId = parseInt(param.valor, 10);
            }
        } catch (error) {
            console.log('Parámetro de subcategoría sistemas no encontrado');
        }
    }

    async guardarParametroSubcategoriaSistemas() {
        try {
            if (!this.subcategoriaSistemasId) return;
            await this.parametrosService.updateParametro('subcategoria_mantenimiento_sistemas', this.subcategoriaSistemasId.toString());
            Swal.fire('Éxito', 'Subcategoría Sistemas actualizada', 'success');
        } catch (error) {
            console.error('Error guardando parámetro de subcategoría sistemas', error);
            Swal.fire('Error', 'No se pudo guardar la subcategoría', 'error');
        }
    }

    goBack() {
        this.router.navigate(['/parametrizacion']);
    }
}
