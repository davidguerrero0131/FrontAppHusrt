import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServicioService } from '../../Services/appServices/general/servicio/servicio.service';
import { MantenimientosService } from '../../Services/appServices/biomedicaServices/mantenimientos/mantenimientos.service';
import { MetrologiaService } from '../../Services/appServices/biomedicaServices/metrologia/metrologia.service';
import { EquiposService } from '../../Services/appServices/biomedicaServices/equipos/equipos.service';
import { ReportesService } from '../../Services/appServices/biomedicaServices/reportes/reportes.service';
import { DropdownModule } from 'primeng/dropdown';
import { RafaIaService } from '../../Services/rafa-ia.service';

export interface IntranetCard {
  id: string;
  title: string;
  subtitle: string;
  url?: string;
  routerLink?: string;
  icon?: string;
  img?: string;
  imgClass?: string;
  category: 'reportes' | 'sistemas' | 'servicios';
}

@Component({
  selector: 'app-intranet',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DropdownModule],
  templateUrl: './intranet.component.html',
  styleUrl: './intranet.component.css'
})
export class IntranetComponent implements OnInit {
  // Servicios inyectados
  private servicioService = inject(ServicioService);
  private mantenimientosService = inject(MantenimientosService);
  private metrologiaService = inject(MetrologiaService);
  private equiposService = inject(EquiposService);
  private reportesService = inject(ReportesService);
  private sanitizer = inject(DomSanitizer);

  safePowerBiUrl!: SafeResourceUrl;
  safeRankingUrl!: SafeResourceUrl;

  private rafaIaService = inject(RafaIaService);

  isChatOpen: boolean = false;
  chatMessages: { role: string, content: string, formattedContent?: string }[] = [];
  userInput: string = '';
  isChatLoading: boolean = false;
  
  private systemPrompt = `Eres Rafa IA, el asistente inteligente y experto de ORBIX, el portal institucional del Hospital Universitario San Rafael de Tunja (HUSRT). Tu tono es amable, profesional, servicial y empático. Responde siempre en español usando formato Markdown para dar estilo a tus respuestas (negritas, viñetas, bloques de código, etc.). Nunca inventes información sobre el hospital si no la sabes.`;
  activePanel: string = 'inicio';
  activeSumerceSubPanel: string = 'que_tan_sumerce';

  favoriteCardIds: string[] = [];

  cards: IntranetCard[] = [
    {
      id: 'sucesos',
      title: 'SUCESOS',
      subtitle: 'Seguridad del Paciente',
      url: 'https://t.almeraim.com/event?data=eyJjb25uZWN0aW9uIjoic2dpaG9zcGl0YWxzYW5yYWZhZWx0dW5qYSIsImFwaWtleSI6ImIzOTUzYzY4NmRlNWZhZWQxY2NmZmU4Y2UxMDYyMzRjOWI0ZDgwOGI0OGY4MmRhNTA2MGFiZWY5YTNjNWVjY2UiLCJlbmRwb2ludCI6Imh0dHBzJTNBJTJGJTJGc2dpLmFsbWVyYWltLmNvbSUyRnNnaSUyRmFwaSUyRnYyJTJGIn0=',
      icon: 'pi-heart-fill',
      category: 'reportes'
    },
    {
      id: 'incidentes',
      title: 'INCIDENTES',
      subtitle: 'Seguridad de la Información',
      url: 'https://e.almeraim.com/survey?data=eyJhcGlrZXkiOiJkZTgxMDk5OTBkYTUzZjc4NmZmZWZiODZiMDFhMjVhZDMzMTc3YjI3NzZiYjY3NDNiZDgzZWJhOTE3Mjg4YmVlIiwiY29ubmVjdGlvbiI6InNnaWhvc3BpdGFsc2FucmFmYWVsdHVuamEiLCJlbmRwb2ludCI6Imh0dHBzJTNBJTJGJTJGc2dpLmFsbWVyYWltLmNvbSUyRnNnaSUyRmFwaSUyRnYyJTJGIiwiY29kZSI6IjAyIn0=',
      icon: 'pi-shield',
      category: 'reportes'
    },
    {
      id: 'sst',
      title: 'REPORTE SST',
      subtitle: 'Incidentes de Seguridad y Salud en el Trabajo',
      url: 'https://e.almeraim.com/survey?data=eyJhcGlrZXkiOiI4NmRkMjMxNjI3MDM1YTNmMGRlMDFjN2VhYzcwYzkxNDdjYjA0ZDFiMDU2MDcyOTY2NTJhZWY0NTFjNTA2ZDRjIiwiY29ubmVjdGlvbiI6InNnaWhvc3BpdGFsc2FucmFmYWVsdHVuamEiLCJlbmRwb2ludCI6Imh0dHBzJTNBJTJGJTJGc2dpLmFsbWVyYWltLmNvbSUyRnNnaSUyRmFwaSUyRnYyJTJGIiwiY29kZSI6IlNTVC1GLTAzIn0=',
      icon: 'pi-briefcase',
      category: 'reportes'
    },
    {
      id: 'almera',
      title: 'ALMERA',
      subtitle: 'Sistema de Gestión Integral',
      url: 'https://sgi.almeraim.com/sgi/?conid=sgihospitalsanrafaeltunja',
      img: 'img/ALMERA.PNG',
      imgClass: 'orbiss-logo-small',
      category: 'sistemas'
    },
    {
      id: 'ranking_boletines',
      title: 'Ranking Boletines',
      subtitle: 'Boletines sumerce completados',
      url: 'http://192.168.10.113/login',
      icon: 'bi-trophy-fill',
      category: 'sistemas'
    },
    {
      id: 'sistema_laboratorio',
      title: 'Sistema Laboratorio',
      subtitle: 'Gestión de Laboratorio Clínico',
      url: 'http://192.168.10.113/login',
      icon: 'bi-droplet-half',
      category: 'sistemas'
    },
    {
      id: 'orbix',
      title: 'ORBIX',
      subtitle: 'Gestión de la Tecnología',
      routerLink: '/login',
      img: 'LogoAgora.png',
      imgClass: 'orbiss-logo-small',
      category: 'sistemas'
    },
    {
      id: 'mesa_servicios',
      title: 'MESA DE SERVICIOS',
      subtitle: 'Soporte (GLPI)',
      url: 'http://192.168.10.111/glpi/front/ticket.php',
      icon: 'pi-headphones',
      category: 'sistemas'
    },
    {
      id: 'web_institucional',
      title: 'PÁGINA WEB INSTITUCIONAL',
      subtitle: 'Sitio Oficial',
      url: 'https://hospitalsanrafaeltunja.gov.co/',
      img: 'san-rafa.png',
      imgClass: 'san-rafa-logo-small',
      category: 'sistemas'
    },
    {
      id: 'plataforma_virtual',
      title: 'PLATAFORMA VIRTUAL',
      subtitle: 'Formación y Capacitación',
      url: 'https://formacionvirtual.hospitalsanrafaeltunja.gov.co/login/index.php',
      icon: 'pi-desktop',
      category: 'sistemas'
    },
    {
      id: '3cx',
      title: '3CX',
      subtitle: 'Sistema de Comunicaciones',
      url: 'https://hospitalsanrafaeldetunja.3cx.co/',
      img: 'img/3CX.png',
      imgClass: 'orbiss-logo-small',
      category: 'sistemas'
    },
    {
      id: 'cirugia',
      title: 'PACIENTES SALAS DE CIRUGIA',
      subtitle: 'Estado de pacientes',
      routerLink: '/servinte/cirugia',
      icon: 'pi-file-edit',
      category: 'servicios'
    },
    {
      id: 'news2',
      title: 'Clasificación de Pacientes News2',
      subtitle: 'Estado de pacientes por servicio',
      routerLink: '/servinte/news2',
      icon: 'pi-users',
      category: 'servicios'
    },
    {
      id: 'reportes_entes_externos',
      title: 'Reportes a entes externos',
      subtitle: 'cumplimiento',
      url: 'https://planner.cloud.microsoft/webui/plan/aOBFuhevzUSTDKc4vAmk1WUACwNC/view/board?tid=3a04f85f-b957-4b7b-9f20-730a43aac993',
      icon: 'pi-file-export',
      category: 'sistemas'
    }
  ];

  get reportesCards() {
    return this.cards.filter(c => c.category === 'reportes');
  }

  get sistemasCards() {
    return this.cards.filter(c => c.category === 'sistemas');
  }

  get serviciosCards() {
    return this.cards.filter(c => c.category === 'servicios');
  }

  get favoriteCardsList() {
    return this.cards.filter(c => this.favoriteCardIds.includes(c.id));
  }

  // Estado del Plan de Mantenimiento
  mantenimientoTab: string = 'biomedica';
  listaServicios: any[] = [];
  selectedServicio: any = null;
  selectedMes: number = new Date().getMonth() + 1; // Mes actual por defecto
  planesMantenimiento: any[] = [];
  planesFiltrados: any[] = [];
  loadingPlanes: boolean = false;

  meses: any[] = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
  ];

  ngOnInit() {
    this.cargarServicios();

    this.safePowerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://app.powerbi.com/view?r=eyJrIjoiYzRiMDEwOTktNzExZi00YmNiLWJjYTAtNmZhZTA0ZmY3NjdhIiwidCI6IjNhMDRmODVmLWI5NTctNGI3Yi05ZjIwLTczMGE0M2FhYzk5MyJ9");
    this.safeRankingUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://app.powerbi.com/view?r=eyJrIjoiNGFjNmE2YmEtNDBiMC00ZDQ0LTllODQtY2VmZTQ2OTIyMWNkIiwidCI6IjNhMDRmODVmLWI5NTctNGI3Yi05ZjIwLTczMGE0M2FhYzk5MyJ9");

    // Cargar favoritos del localStorage si el entorno lo permite
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedFavs = localStorage.getItem('intranet_favorites');
      if (savedFavs) {
        try {
          this.favoriteCardIds = JSON.parse(savedFavs);
        } catch(e) {
          this.favoriteCardIds = [];
        }
      }
    }
  }

  async cargarServicios() {
    try {
      const response: any = await this.servicioService.getAllServiciosPublico();
      if (Array.isArray(response)) {
        this.listaServicios = response;
      } else if (response && Array.isArray(response.data)) {
        this.listaServicios = response.data;
      } else {
        this.listaServicios = [];
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      this.listaServicios = [];
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.chatMessages.length === 0) {
      this.chatMessages = [
        { role: 'assistant', content: '¡Hola! Soy Rafa, tu asistente inteligente. ¿En qué te puedo ayudar hoy?', formattedContent: '¡Hola! Soy Rafa, tu asistente inteligente. ¿En qué te puedo ayudar hoy?' }
      ];
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight < 150 ? textarea.scrollHeight : 150) + 'px';
  }

  resetTextarea() {
    setTimeout(() => {
      const textarea = document.querySelector('.chat-input-area textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }, 0);
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    let formatted = text;
    
    formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/_([^_]+)_/g, '<em>$1</em>');
    formatted = formatted.replace(/^- (.*)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">$1</ul>');
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/<pre([^>]*)><br>/g, '<pre$1>');
    formatted = formatted.replace(/<\/ul><br>/g, '</ul>');
    
    return formatted;
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isChatLoading) return;

    const userMessage = this.userInput;
    this.chatMessages.push({ role: 'user', content: userMessage, formattedContent: this.formatMarkdown(userMessage) });
    this.userInput = '';
    this.isChatLoading = true;
    this.resetTextarea();

    try {
      const apiMessages = [
        { role: 'system', content: this.systemPrompt },
        ...this.chatMessages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      const response = await this.rafaIaService.sendMessage(apiMessages).toPromise();
      
      let responseContent = '';
      if (response && response.choices && response.choices.length > 0) {
        responseContent = response.choices[0].message.content;
      } else if (response && response.message) {
        responseContent = response.message.content;
      }

      if (responseContent) {
        this.chatMessages.push({ 
          role: 'assistant', 
          content: responseContent,
          formattedContent: this.formatMarkdown(responseContent)
        });
      }
    } catch (error: any) {
      console.error('Error connecting to Ollama API:', error);
      const errorMsg = `Lo siento, no me pude conectar con mi cerebro local en este momento. (Error HTTP: ${error.status} - ${error.statusText || 'Desconocido'}. Mensaje: ${error.message})`;
      this.chatMessages.push({ role: 'assistant', content: errorMsg, formattedContent: errorMsg });
    } finally {
      this.isChatLoading = false;
      
      // Auto-scroll al final del chat flotante
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 50);
    }
  }

  setActivePanel(panel: string) {
    this.activePanel = panel;
  }

  setSumerceSubPanel(subPanel: string) {
    this.activeSumerceSubPanel = subPanel;
  }

  toggleFavorite(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.favoriteCardIds.includes(id)) {
      this.favoriteCardIds = this.favoriteCardIds.filter(fId => fId !== id);
    } else {
      this.favoriteCardIds.push(id);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('intranet_favorites', JSON.stringify(this.favoriteCardIds));
    }
  }

  isFavorite(id: string): boolean {
    return this.favoriteCardIds.includes(id);
  }

  setMantenimientoTab(tab: string) {
    this.mantenimientoTab = tab;
    this.planesFiltrados = [];
  }

  async consultarPlanMantenimiento() {
    if (!this.selectedServicio) return;

    this.loadingPlanes = true;
    this.planesFiltrados = [];

    const servicioId = (this.selectedServicio && typeof this.selectedServicio === 'object') ? this.selectedServicio.id : this.selectedServicio;

    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;

    try {
      if (this.mantenimientoTab === 'biomedica') {
        // 1. Obtener TODOS los equipos del servicio (Ruta pública para mayor fiabilidad)
        const unwrapArray = (res: any) => Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);

        let todosLosEquiposRaw = await this.equiposService.getAllEquiposServicioPublico(servicioId);
        let todosLosEquipos = unwrapArray(todosLosEquiposRaw);

        if (!todosLosEquipos || todosLosEquipos.length === 0) {
          console.warn('Respuesta inesperada o vacía al obtener equipos:', todosLosEquiposRaw);
        }

        // 2. Obtener planes y reportes (Rutas públicas)
        const [mantenimientoPlanes, metrologiaPlanes, reportesMes] = await Promise.all([
          this.mantenimientosService.getPlanMantenimientoServicioPublico(servicioId),
          this.metrologiaService.getPlanAMetrologicasServicioPublico(servicioId),
          this.reportesService.getReportesPreventivosServicioMesPublico(servicioId, this.selectedMes, anioActual)
        ]);

        const planesM = unwrapArray(mantenimientoPlanes);
        const planesMet = unwrapArray(metrologiaPlanes);
        const reportes = unwrapArray(reportesMes);

        // 3. Filtrar planes por el mes seleccionado
        const planesM_mes = planesM.filter((p: any) => p && p.mes == this.selectedMes);
        const planesMet_mes = planesMet.filter((p: any) => p && p.mes == this.selectedMes);

        // 4. Mapear cada equipo con su estado de plan y reporte
        this.planesFiltrados = todosLosEquipos.map((eq: any) => {
          const planM = planesM_mes.find((p: any) => p.equipoIdFk === eq.id);
          const planMet = planesMet_mes.find((p: any) => p.equipoIdFk === eq.id);

          if (!planM && !planMet) return null;

          // Lógica de estado para mantenimiento según reportes
          let estadoMantenimiento = 'PROGRAMADO';
          const reporteEq = reportes.find((r: any) => r.equipoIdFk === eq.id);

          if (reporteEq) {
            estadoMantenimiento = reporteEq.realizado ? 'REALIZADO' : 'PROGRAMADO';
          } else {
            // Si no hay reporte, verificamos si es mes futuro
            if (this.selectedMes > mesActual) {
              estadoMantenimiento = 'PLANEADO';
            } else {
              estadoMantenimiento = 'PROGRAMADO';
            }
          }

          return {
            equipo: eq,
            hasMantenimiento: !!planM,
            hasMetrologia: !!planMet,
            estadoMantenimiento: estadoMantenimiento,
            tipoActividad: planMet ? planMet.tipoActividad : (eq.tipoEquipos?.requiereMetrologia ? 'Pendiente Programar' : null)
          };
        }).filter((item: any) => item !== null);
      } else {
        this.planesFiltrados = [];
      }
    } catch (error) {
      console.error('Error al consultar plan:', error);
    } finally {
      this.loadingPlanes = false;
    }
  }
}
