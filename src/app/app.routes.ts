import { OlvidoContrasenaComponent } from './Components/gestionarContraseña/olvido-contrasena/olvido-contrasena.component';
import { InspeccionListComponent } from './Components/usermantenimientoareas/areasFisicas/inspeccion/inspeccion-list.component';
import { ManageInspeccionComponent } from './Components/usermantenimientoareas/areasFisicas/inspeccion/manage-inspeccion.component';
import { GestionOperativaComponent } from './Components/usermantenimientoareas/gestion-operativa/gestion-operativa.component';
import { InventarioComponent } from './Components/usermantenimientoareas/inventario/inventario.component';
import { ServiciosComponent } from './Components/usermantenimientoareas/servicios/servicios.component';
import { AreasPorServicioComponent } from './Components/usermantenimientoareas/areas-por-servicio/areas-por-servicio.component';
import { DetalleServicioComponent } from './Components/usermantenimientoareas/detalle-servicio/detalle-servicio.component';
import { MantenimientosServicioComponent } from './Components/usermantenimientoareas/mantenimientos-servicio/mantenimientos-servicio.component';
import { InspeccionesServicioComponent } from './Components/usermantenimientoareas/inspecciones-servicio/inspecciones-servicio.component';
import { ElementosAreaComponent } from './Components/usermantenimientoareas/elementos-area/elementos-area.component';
import { MantenimientosAreaComponent } from './Components/usermantenimientoareas/mantenimientos-area/mantenimientos-area.component';
import { MantenimientoDashboardComponent } from './Components/usermantenimientoareas/gestion-operativa/mantenimiento-dashboard/mantenimiento-dashboard.component';
import { InspeccionesAreaComponent } from './Components/usermantenimientoareas/inspecciones-area/inspecciones-area.component';

import { NgModule } from '@angular/core';
import { authGuard } from './auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { ReportceComponent } from './Components/Imaging/ReportCE/reportce/reportce.component';
import { ReportspediatricsComponent } from './Components/Servinte/Reports/reportspediatrics/reportspediatrics.component';
import { UsuariosServicioComponent } from './Components/News2/usuarios-servicio/usuarios-servicio.component';
import { AerolineaComponent } from './Components/Aerolinea/aerolinea/aerolinea.component';
import { LoginComponent } from './Components/login/login.component'
import { HomesuperadminComponent } from './Components/Homepage/homesuperadmin/homesuperadmin.component'
import { HomeadminsistemasComponent } from './Components/Homepage/homeadminsistemas/homeadminsistemas.component'
import { HomeadminbiomedicaComponent } from './Components/Homepage/homeadminbiomedica/homeadminbiomedica.component';
import { HomeadminmantenimientoComponent } from './Components/Homepage/homeadminmantenimiento/homeadminmantenimiento.component';
import { RegistroComponent } from './Components/registro/registro.component';
import { GestionUsuariosComponent } from './Components/gestion-usuarios/gestion-usuarios.component';
import { HomeusermantenimientoComponent } from './Components/Homepage/homeusermantenimiento/homeusermantenimiento.component';
import { HomeusersistemasComponent } from './Components/Homepage/homeusersistemas/homeusersistemas.component';
import { HomeuserbiomedicaComponent } from './Components/Homepage/homeuserbiomedica/homeuserbiomedica.component';
import { HomeadminmesaserviciosComponent } from './Components/Homepage/homeadminmesaservicios/homeadminmesaservicios.component';
import { ClasificacionInventarioComponent } from './Components/userBiomedica/clasificacion-inventario/clasificacion-inventario.component';
import { ManteniminetoComponent } from './Components/userBiomedica/mantenimineto/mantenimineto.component';
import { SemaforizacionComponent } from './Components/userBiomedica/semaforizacion/semaforizacion.component';
import { IndicadoresComponent } from './Components/userBiomedica/indicadores/indicadores.component';
import { CalendarioComponent } from './Components/userBiomedica/calendario/calendario.component';
import { ClasificacionTipoEquipoComponent } from './Components/userBiomedica/clasificacion-tipo-equipo/clasificacion-tipo-equipo.component';
import { ClasificacionServicioComponent } from './Components/userBiomedica/clasificacion-servicio/clasificacion-servicio.component';
import { ClasificacionComodatosComponent } from './Components/userBiomedica/clasificacion-comodatos/clasificacion-comodatos.component';
import { EquiposServicioComponent } from './Components/userBiomedica/vista-Equipos/equipos-servicio/equipos-servicio.component';
import { EquiposTipoComponent } from './Components/userBiomedica/vista-Equipos/equipos-tipo/equipos-tipo.component';
import { EquiposComodatosComponent } from './Components/userBiomedica/vista-Equipos/equipos-comodatos/equipos-comodatos.component';
import { EditarUsuarioComponent } from './Components/editar-usuario/editar-usuario.component';
import { CambiarContrasenaComponent } from './Components/gestionarContraseña/cambiar-contrasena/cambiar-contrasena.component';
import { CrearReporteComponent } from './Components/userBiomedica/Reportes/crear-reporte/crear-reporte.component';
import { HojavidaComponent } from './Components/userBiomedica/vista-Equipos/hojavida/hojavida.component';
import { VerReporteComponent } from './Components/userBiomedica/Reportes/ver-reporte/ver-reporte.component';
import { ActividadesMetrologicasComponent } from './Components/userBiomedica/actividades-metrologicas/actividades-metrologicas.component';
import { IntranetComponent } from './Components/intranet/intranet.component';
import { ValidadorQRComponent } from './Components/userBiomedica/Reportes/validador-qr/validador-qr.component';
import { CrearEquipoComponent } from './Components/userBiomedica/vista-Equipos/crear-equipo/crear-equipo.component';
import { CirugiaComponent } from './Components/cirugia/cirugia.component';
import { AdmtiposequipoComponent } from './Components/administracion/admtiposequipo/admtiposequipo.component';
import { AdmserviciosComponent } from './Components/administracion/admservicios/admservicios.component';
import { AreasListComponent } from './Components/usermantenimientoareas/areasFisicas/areas-list/areas-list.component';
import { ManageAreaComponent } from './Components/usermantenimientoareas/areasFisicas/manage-area/manage-area.component';
import { ElementosListComponent } from './Components/usermantenimientoareas/areasFisicas/elementos/elementos-list/elementos-list.component';
import { ManageElementoComponent } from './Components/usermantenimientoareas/areasFisicas/elementos/manage-elemento/manage-elemento.component';
import { ManagePlanMantenimientoComponent } from './Components/usermantenimientoareas/areasFisicas/plan-mantenimiento/manage-plan-mantenimiento.component';
import { PlanMantenimientoListComponent } from './Components/usermantenimientoareas/areasFisicas/plan-mantenimiento/plan-mantenimiento-list.component';
import { ManageAreaElementosComponent } from './Components/usermantenimientoareas/areasFisicas/area-elementos/manage-area-elementos.component';
import { AreaElementosListComponent } from './Components/usermantenimientoareas/areasFisicas/area-elementos/area-elementos-list.component';
import { ManageReporteMantenimientoComponent } from './Components/usermantenimientoareas/areasFisicas/reporte-mantenimiento/manage-reporte-mantenimiento.component';
import { ReportesAreaListComponent } from './Components/usermantenimientoareas/areasFisicas/reporte-mantenimiento/reportes-area-list.component';
import { AllReportesListComponent } from './Components/usermantenimientoareas/areasFisicas/reporte-mantenimiento/all-reportes-list.component';
import { roleGuard } from './role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'updateprofil', component: EditarUsuarioComponent, canActivate: [authGuard] },
  { path: 'superadmin', component: HomesuperadminComponent, canActivate: [authGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [authGuard] },
  { path: 'adminsistemas', component: HomeadminsistemasComponent, canActivate: [authGuard] },
  { path: 'adminbiomedica', component: HomeadminbiomedicaComponent, canActivate: [authGuard] },
  {
    path: 'adminmantenimiento',
    component: HomeadminmantenimientoComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] }
  },
  { path: 'adminmesaservicios', component: HomeadminmesaserviciosComponent, canActivate: [authGuard] },
  { path: 'usermantenimiento', component: HomeusermantenimientoComponent, canActivate: [authGuard] },
  { path: 'usersistemas', component: HomeusersistemasComponent, canActivate: [authGuard] },
  { path: 'userbiomedica', component: HomeuserbiomedicaComponent, canActivate: [authGuard] },
  { path: 'imagenologia/citasCE', component: ReportceComponent },
  { path: 'servinte/reportepediatria', component: ReportspediatricsComponent },
  { path: 'servinte/news2', component: UsuariosServicioComponent },
  { path: 'servinte/cirugia', component: CirugiaComponent },
  { path: 'acreditacion/aerolinea', component: AerolineaComponent },
  { path: 'admusuarios', component: GestionUsuariosComponent, canActivate: [authGuard] },

  { path: 'olvidocontraseña', component: OlvidoContrasenaComponent },
  { path: 'recuperarcontraseña', component: CambiarContrasenaComponent },

  // UsuarioBiomedica

  { path: 'biomedica/nuevoequipo', component: CrearEquipoComponent, canActivate: [authGuard] },
  { path: 'biomedica/inventario', component: ClasificacionInventarioComponent, canActivate: [authGuard] },
  { path: 'biomedica/mantenimiento', component: ManteniminetoComponent, canActivate: [authGuard] },
  { path: 'biomedica/semaforizacion', component: SemaforizacionComponent, canActivate: [authGuard] },
  { path: 'biomedica/indicadores', component: IndicadoresComponent, canActivate: [authGuard] },
  { path: 'biomedica/calendario', component: CalendarioComponent, canActivate: [authGuard] },
  { path: 'biomedica/actividadesmetrologicas', component: ActividadesMetrologicasComponent, canActivate: [authGuard] },
  { path: 'biomedica/tiposequipo', component: ClasificacionTipoEquipoComponent, canActivate: [authGuard] },
  { path: 'biomedica/servicios', component: ClasificacionServicioComponent, canActivate: [authGuard] },
  { path: 'biomedica/empComodatos', component: ClasificacionComodatosComponent, canActivate: [authGuard] },
  { path: 'biomedica/equiposservicio', component: EquiposServicioComponent, canActivate: [authGuard] },
  { path: 'biomedica/equipostipo', component: EquiposTipoComponent, canActivate: [authGuard] },
  { path: 'biomedica/equiposcomodatos', component: EquiposComodatosComponent, canActivate: [authGuard] },
  { path: 'biomedica/nuevoreporte/:id', component: CrearReporteComponent, canActivate: [authGuard] },
  { path: 'biomedica/reportesequipo/:id', component: VerReporteComponent, canActivate: [authGuard] },
  { path: 'biomedica/hojavidaequipo/:id', component: HojavidaComponent, canActivate: [authGuard] },
  { path: 'biomedica/validarqr', component: ValidadorQRComponent, canActivate: [authGuard] },
  { path: 'admin/tiposequipo', component: AdmtiposequipoComponent, canActivate: [authGuard] },
  { path: 'admin/servicios', component: AdmserviciosComponent, canActivate: [authGuard] },

  // Áreas Físicas
  { path: 'areas/listado', component: AreasListComponent, canActivate: [authGuard] },
  { path: 'areas/crear', component: ManageAreaComponent, canActivate: [authGuard] },
  { path: 'areas/editar/:id', component: ManageAreaComponent, canActivate: [authGuard] },

  // Elementos
  { path: 'elementos/listado', component: ElementosListComponent, canActivate: [authGuard] },
  { path: 'elementos/crear', component: ManageElementoComponent, canActivate: [authGuard] },
  { path: 'elementos/editar/:id', component: ManageElementoComponent, canActivate: [authGuard] },
  { path: 'areas/asignar-elementos', component: AreaElementosListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/asignar-elementos/gestionar', component: ManageAreaElementosComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/asignar-elementos/gestionar/:id', component: ManageAreaElementosComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/planes/listado', component: PlanMantenimientoListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/planes/crear', component: ManagePlanMantenimientoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/planes/editar/:id', component: ManagePlanMantenimientoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },

  // Inspecciones
  { path: 'areas/inspecciones/listado', component: InspeccionListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/inspecciones/crear', component: ManageInspeccionComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/inspecciones/editar/:id', component: ManageInspeccionComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },

  // Reportes Mantenimiento
  { path: 'areas/reportes/mantenimiento/crear', component: ManageReporteMantenimientoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'areas/reportes/mantenimiento/editar/:id', component: ManageReporteMantenimientoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },

  { path: 'intranet', component: IntranetComponent },

  // User Mantenimiento Areas Dashboards
  { path: 'adminmantenimiento/gestion-operativa', component: GestionOperativaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/gestion-operativa/mantenimiento', component: MantenimientoDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },

  { path: 'adminmantenimiento/inventario', component: InventarioComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/servicios', component: ServiciosComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/areas-por-servicio/:id', component: AreasPorServicioComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/detalle-servicio/:id', component: DetalleServicioComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/mantenimientos-servicio/:id', component: MantenimientosServicioComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/inspecciones-servicio/:id', component: InspeccionesServicioComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/elementos-area/:id', component: ElementosAreaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/mantenimientos-area/:id', component: MantenimientosAreaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/inspecciones-area/:id', component: InspeccionesAreaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/reportes-area/:id', component: ReportesAreaListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } },
  { path: 'adminmantenimiento/reportes-general', component: AllReportesListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['MANTENIMIENTOADMIN', 'ADMINMANTENIMIENTO'] } }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
