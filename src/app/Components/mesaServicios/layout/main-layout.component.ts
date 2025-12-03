// Componente de layout principal con sidebar y header
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../../../Services/mesaServicios/auth.service';
import { NotificacionesService } from '../../../Services/mesaServicios/notificaciones.service';
import { ContadorNotificaciones } from '../../../models/mesaServicios/notificacion.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(50, [
            animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class MainLayoutComponent implements OnInit {
  sidebarAbierto = true;
  menuUsuarioAbierto = false;
  notificacionesAbiertas = false;
  usuario: any;
  contadorNotificaciones: ContadorNotificaciones = { no_leidas: 0, total: 0 };

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      ruta: '/mesaservicios/dashboard',
      visible: true
    },
    {
      label: 'Casos',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      ruta: '/mesaservicios/casos',
      visible: true
    },
    {
      label: 'Nuevo Caso',
      icon: 'M12 4v16m8-8H4',
      ruta: '/mesaservicios/casos/nuevo',
      visible: true
    },
    {
      label: 'Usuarios',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      ruta: '/mesaservicios/admin/usuarios',
      visible: true,
      soloAdmin: true
    },
    {
      label: 'Áreas',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      ruta: '/mesaservicios/admin/areas',
      visible: true,
      soloAdmin: true
    },
    {
      label: 'Servicios',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      ruta: '/mesaservicios/admin/servicios',
      visible: true,
      soloAdmin: true
    },
    {
      label: 'Categorías',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      ruta: '/mesaservicios/admin/categorias',
      visible: true,
      soloAdmin: true
    }
  ];

  constructor(
    private authService: AuthService,
    private notificacionesService: NotificacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar usuario inmediatamente si ya existe en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      this.actualizarMenuVisible();
    }

    // Suscribirse a cambios futuros del usuario
    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuario = usuario;
      this.actualizarMenuVisible();
    });

    // Iniciar polling de notificaciones
    this.notificacionesService.iniciarPolling().subscribe(response => {
      if (response.exito && response.datos) {
        this.contadorNotificaciones = response.datos;
      }
    });
  }

  actualizarMenuVisible(): void {
    const esAdmin = this.authService.esAdministrador();
    this.menuItems.forEach(item => {
      if (item.soloAdmin) {
        item.visible = esAdmin;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  toggleMenuUsuario(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
    this.notificacionesAbiertas = false;
  }

  toggleNotificaciones(): void {
    this.notificacionesAbiertas = !this.notificacionesAbiertas;
    this.menuUsuarioAbierto = false;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  verPerfil(): void {
    this.router.navigate(['/mesaservicios/perfil']);
    this.menuUsuarioAbierto = false;
  }

  cambiarContrasena(): void {
    this.router.navigate(['/mesaservicios/cambiar-contrasena']);
    this.menuUsuarioAbierto = false;
  }

  marcarTodasLeidas(): void {
    this.notificacionesService.marcarTodasLeidas().subscribe(() => {
      this.contadorNotificaciones.no_leidas = 0;
    });
  }

  verTodasNotificaciones(): void {
    this.router.navigate(['/mesaservicios/notificaciones']);
    this.notificacionesAbiertas = false;
  }
}
