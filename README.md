# AppHUSRT Integrado - Frontend

Frontend del sistema integrado del Hospital Universitario San Rafael de Tunja (HUSRT), desarrollado con Angular 17+. Incluye los módulos de **Biomédica** y **Mesa de Servicios**.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Principales](#módulos-principales)
- [Build para Producción](#build-para-producción)
- [Guía de Estilos](#guía-de-estilos)

---

## 📖 Descripción

Aplicación web moderna desarrollada con Angular 17+ que proporciona una interfaz intuitiva para:

### Módulo Biomédica
- Gestión visual de equipos biomédicos
- Registro de hojas de vida
- Programación de mantenimientos
- Actividades metrológicas
- Reportes interactivos

### Módulo Mesa de Servicios
- Sistema de tickets/casos con estados visuales
- Dashboard con estadísticas en tiempo real
- Notificaciones en tiempo real
- Gestión de seguimientos con timeline
- Administración de usuarios, áreas, servicios y categorías
- Sistema de asignación de casos
- Formatos dinámicos personalizables

---

## 🛠️ Tecnologías

- **Angular** v17+ - Framework principal
- **TypeScript** v5+ - Lenguaje de programación
- **Tailwind CSS** v3+ - Framework de estilos
- **Angular Router** - Navegación SPA
- **RxJS** - Programación reactiva
- **HttpClient** - Comunicación con API
- **Standalone Components** - Arquitectura moderna de Angular

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** (v9 o superior) o **yarn**
- **Angular CLI** (v17 o superior)

Instala Angular CLI globalmente si no lo tienes:
```bash
npm install -g @angular/cli
```

---

## 🚀 Instalación

1. **Navega al directorio frontend**:
```bash
cd AppHUSRT_Integrado/frontend
```

2. **Instala las dependencias**:
```bash
npm install
```

---

## ⚙️ Configuración

### Environment Files

La aplicación usa diferentes archivos de configuración para cada entorno:

#### Desarrollo (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3005'
};
```

#### Producción (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.husrt.gov.co'  // URL de producción
};
```

**⚠️ Importante**: Asegúrate de que `apiUrl` apunte al backend correcto.

---

## ▶️ Ejecución

### Modo Desarrollo

Inicia el servidor de desarrollo:

```bash
ng serve
```

O con npm:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

**Características del modo desarrollo**:
- ✅ Hot reload automático
- ✅ Source maps para debugging
- ✅ Mensajes de error detallados
- ✅ Recarga automática al guardar cambios

### Especificar Puerto

```bash
ng serve --port 4300
```

### Abrir Automáticamente en el Navegador

```bash
ng serve --open
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── Components/
│   │   │   ├── biomedica/          # Componentes del módulo biomédica
│   │   │   │   ├── equipos/
│   │   │   │   ├── hojas-vida/
│   │   │   │   └── ...
│   │   │   ├── mesaServicios/      # Componentes del módulo mesa de servicios
│   │   │   │   ├── layout/
│   │   │   │   │   └── main-layout.component.ts
│   │   │   │   ├── dashboard/
│   │   │   │   ├── casos/
│   │   │   │   │   ├── lista-casos.component.ts
│   │   │   │   │   ├── nuevo-caso.component.ts
│   │   │   │   │   └── detalle-caso.component.ts
│   │   │   │   ├── admin/
│   │   │   │   │   ├── usuarios-admin.component.ts
│   │   │   │   │   ├── areas-admin.component.ts
│   │   │   │   │   ├── servicios-admin.component.ts
│   │   │   │   │   └── categorias-admin.component.ts
│   │   │   │   └── auth/
│   │   │   │       └── login.component.ts
│   │   │   └── shared/             # Componentes compartidos
│   │   ├── Services/
│   │   │   ├── biomedica/          # Servicios del módulo biomédica
│   │   │   └── mesaServicios/      # Servicios del módulo mesa de servicios
│   │   │       ├── auth.service.ts
│   │   │       ├── casos.service.ts
│   │   │       ├── seguimientos.service.ts
│   │   │       ├── notificaciones.service.ts
│   │   │       ├── areas.service.ts
│   │   │       ├── servicios.service.ts
│   │   │       └── categorias.service.ts
│   │   ├── models/
│   │   │   ├── biomedica/          # Interfaces del módulo biomédica
│   │   │   └── mesaServicios/      # Interfaces del módulo mesa de servicios
│   │   │       ├── caso.model.ts
│   │   │       ├── seguimiento.model.ts
│   │   │       ├── usuario.model.ts
│   │   │       ├── area.model.ts
│   │   │       └── ...
│   │   ├── guards/                 # Route guards
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/           # HTTP interceptors
│   │   │   └── auth.interceptor.ts
│   │   └── app.routes.ts           # Configuración de rutas
│   ├── assets/                     # Recursos estáticos
│   │   ├── images/
│   │   └── icons/
│   ├── environments/               # Configuración por entorno
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css                  # Estilos globales
│   ├── index.html
│   └── main.ts                     # Punto de entrada
├── angular.json                    # Configuración de Angular
├── tailwind.config.js             # Configuración de Tailwind CSS
├── tsconfig.json                   # Configuración de TypeScript
├── package.json
└── README.md
```

---

## 🧩 Módulos Principales

### Módulo: Mesa de Servicios

Sistema completo de gestión de tickets/casos.

#### Componentes Principales

**Dashboard**
- Vista general con estadísticas
- Gráficos interactivos
- Casos recientes
- Notificaciones

**Gestión de Casos**
- `lista-casos.component.ts` - Lista de casos con filtros y paginación
- `nuevo-caso.component.ts` - Formulario para crear casos con formatos dinámicos
- `detalle-caso.component.ts` - Vista detallada con timeline de seguimientos

**Administración**
- `usuarios-admin.component.ts` - CRUD de usuarios con filtros por rol y área
- `areas-admin.component.ts` - Gestión de áreas con vista jerárquica
- `servicios-admin.component.ts` - Gestión de servicios por área
- `categorias-admin.component.ts` - Gestión de categorías por servicio

**Layout**
- `main-layout.component.ts` - Layout principal con sidebar y header
- Sistema de notificaciones en tiempo real
- Menú responsive

#### Características Destacadas

✨ **Sistema de Seguimientos**
- Timeline visual con logs y seguimientos
- Diferenciación de tipos (log, seguimiento, solución)
- Muestra usuario, fecha y hora
- Permite agregar seguimientos en tiempo real

✨ **Cierre de Casos**
- Admins pueden cerrar cualquier caso
- Usuarios asignados pueden cerrar sus propios casos
- Validación de permisos en frontend y backend

✨ **Notificaciones en Tiempo Real**
- Polling cada 30 segundos
- Badge con contador de no leídas
- Panel desplegable con últimas notificaciones

✨ **Formatos Dinámicos**
- Sistema de campos personalizables por categoría
- Tipos: texto, número, fecha, select, textarea
- Validación dinámica

---

## 🎨 Guía de Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS con clases de utilidad:

```html
<!-- Ejemplo de card -->
<div class="card">
  <h2 class="text-xl font-semibold text-gray-900 mb-4">Título</h2>
  <p class="text-gray-600">Contenido</p>
</div>
```

### Clases Personalizadas

Definidas en `src/styles.css`:

```css
/* Botones */
.btn-primary      /* Botón principal azul */
.btn-secondary    /* Botón secundario gris */
.btn-danger       /* Botón de peligro rojo */

/* Cards */
.card             /* Card base con sombra y padding */

/* Badges de prioridad */
.badge-prioridad-baja      /* Verde */
.badge-prioridad-media     /* Amarillo */
.badge-prioridad-alta      /* Naranja */
.badge-prioridad-critica   /* Rojo */

/* Inputs */
.input-field      /* Input de texto estándar */
.select-field     /* Select estándar */
```

### Paleta de Colores

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  hospital: {
    500: '#1e40af',
    600: '#1e3a8a',
  }
}
```

---

## 🏗️ Build para Producción

### Compilar para Producción

```bash
ng build --configuration production
```

O con npm:

```bash
npm run build
```

Los archivos compilados estarán en `/dist/frontend/`

### Características del Build de Producción

- ✅ Minificación de código
- ✅ Tree shaking
- ✅ Optimización de bundles
- ✅ Hashing de archivos para caché
- ✅ AOT (Ahead of Time) compilation
- ✅ Eliminación de código muerto

### Análisis del Bundle

Para analizar el tamaño de los bundles:

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json
```

---

## 🔐 Autenticación y Guards

### AuthGuard

Protege rutas que requieren autenticación:

```typescript
// app.routes.ts
{
  path: 'mesaservicios',
  component: MainLayoutComponent,
  canActivate: [AuthGuard],
  children: [...]
}
```

### RoleGuard

Protege rutas por rol específico:

```typescript
{
  path: 'admin/usuarios',
  component: UsuariosAdminComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['SUPERADMIN', 'MESASERVICIOSADMIN'] }
}
```

### Auth Interceptor

Agrega automáticamente el token JWT a todas las peticiones HTTP:

```typescript
// Configurado en app.config.ts
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

---

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
ng test
```

### Ejecutar Tests E2E

```bash
ng e2e
```

---

## 📱 Responsive Design

La aplicación es completamente responsive:

- **Desktop** (1024px+): Sidebar fijo, vista completa
- **Tablet** (768px - 1023px): Sidebar colapsable
- **Mobile** (< 768px): Sidebar como drawer, navegación adaptada

---

## 🚀 Optimizaciones Implementadas

### Performance

- ✅ Lazy loading de módulos
- ✅ OnPush change detection strategy en componentes clave
- ✅ Standalone components (reduce bundle size)
- ✅ Debounce en búsquedas y filtros
- ✅ Virtual scrolling para listas largas

### UX/UI

- ✅ Loading states
- ✅ Error handling con mensajes user-friendly
- ✅ Confirmaciones para acciones destructivas
- ✅ Animaciones suaves (fade, slide)
- ✅ Feedback visual en acciones

---

## 🐛 Troubleshooting

### Error: "Cannot GET /"

**Problema**: Al recargar en una ruta que no es la raíz

**Solución**: Configura el servidor web para redirigir todo a `index.html`

### Error: "CORS blocked"

**Problema**: El backend no permite peticiones desde localhost:4200

**Solución**: Verifica que el backend tenga CORS habilitado para el origen del frontend

### Error: "Cannot find module '@angular/...'

**Solución**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas de Tailwind CSS

Si los estilos no se aplican:

1. Verifica que `tailwind.config.js` esté configurado
2. Verifica que `styles.css` importe Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📝 Convenciones de Código

### Nombres de Archivos

- Componentes: `nombre-componente.component.ts`
- Servicios: `nombre.service.ts`
- Modelos: `nombre.model.ts`
- Guards: `nombre.guard.ts`

### Estructura de Componentes

```typescript
@Component({
  selector: 'app-nombre',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './nombre.component.html'
})
export class NombreComponent implements OnInit {
  // Propiedades públicas
  // Propiedades privadas

  constructor(
    private servicio: AlgunServicio
  ) {}

  ngOnInit(): void {
    // Inicialización
  }

  // Métodos públicos
  // Métodos privados
}
```

---

## 🔄 Flujo de Datos

```
Usuario → Componente → Servicio → HTTP → Backend API
                ↓
            Template (HTML)
```

### Ejemplo: Crear un Caso

1. Usuario llena formulario en `nuevo-caso.component.ts`
2. Componente llama a `casosService.crear(datos)`
3. Servicio hace petición HTTP POST al backend
4. Backend responde con el caso creado
5. Servicio retorna Observable
6. Componente subscribe y muestra mensaje de éxito
7. Navega a la lista de casos

---

## 📚 Recursos Útiles

- [Documentación de Angular](https://angular.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RxJS Operators](https://rxjs.dev/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👥 Usuarios de Prueba

Después de ejecutar el script de reset del backend, puedes usar estos usuarios:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| superadmin@husrt.gov.co | 123456 | SUPERADMIN |
| adminmesa@husrt.gov.co | 123456 | Admin Mesa de Servicios |
| ctecnico@husrt.gov.co | 123456 | Soporte TI |
| msoporte@husrt.gov.co | 123456 | Soporte Infraestructura |
| jperez@husrt.gov.co | 123456 | Usuario Regular |

---

## 📄 Licencia

Este proyecto es propiedad del Hospital Universitario San Rafael de Tunja (HUSRT).

---

## 📞 Soporte

Para soporte técnico o dudas, contacta al equipo de desarrollo del HUSRT.
