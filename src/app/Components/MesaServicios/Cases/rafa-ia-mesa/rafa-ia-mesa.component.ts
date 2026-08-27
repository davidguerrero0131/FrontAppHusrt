import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RafaIaService } from '../../../../Services/rafa-ia.service';
import { API_URL } from '../../../../constantes';

@Component({
  selector: 'app-rafa-ia-mesa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rafa-ia-mesa.component.html',
  styleUrl: './rafa-ia-mesa.component.css'
})
export class RafaIaMesaComponent implements OnInit, AfterViewChecked {
  private rafaIaService = inject(RafaIaService);
  private http = inject(HttpClient);

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  chatMessages: { role: string, content: string, formattedContent?: string }[] = [];
  userInput: string = '';
  isChatLoading: boolean = false;
  isChatOpen: boolean = false;

    private baseSystemPrompt = `Eres Rafa IA, el sistema experto de clasificación para la Mesa de Servicios.
Tu tarea es leer el problema del usuario y buscar qué "Descripción de la subcategoría" o "Descripción de la categoría" encaja PERFECTAMENTE con su solicitud, para así darle la ruta exacta (Servicio -> Categoría -> Subcategoría).

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. NO ALUCINES NOMBRES. NUNCA INVENTES DATOS.
2. COHERENCIA JERÁRQUICA: La ruta debe ser extraída del árbol exactamente como aparece.
3. LEE LAS DESCRIPCIONES: Presta especial atención al texto de "Descripción de la subcategoría". Si el usuario dice "crear usuario nuevo", busca la subcategoría cuya descripción hable de crear usuarios.
4. SOLO ESCRIBE LOS NOMBRES: Al dar tu respuesta final, pon ÚNICAMENTE los nombres limpios, sin incluir sus descripciones.
5. Responde EXACTAMENTE con esta estructura (sin agregar nada más):

**Análisis rápido:** [Una breve explicación conectando lo que pidió el usuario con las descripciones que leíste en la lista]

¡Hola! Con gusto te oriento. Basado en lo que me cuentas:
- **El servicio que debes seleccionar es:** [Nombre del Servicio]
- **La categoría es:** [Nombre de la Categoría]
- **La subcategoría es:** [Nombre de la Subcategoría]`;

  private currentSystemPrompt = '';

  ngOnInit() {
    this.startNewChat();
    this.loadCategoriasToPrompt();
  }

  loadCategoriasToPrompt() {
    this.http.get<any[]>(`${API_URL}/api/mesa/config/categorias/all`).subscribe({
      next: (data) => {
        let markdownList = '';
        const groupedByService: any = {};

        data.forEach(cat => {
            const serviceName = cat.servicio?.nombres || 'General';
            if (!groupedByService[serviceName]) groupedByService[serviceName] = [];

            // Map subcategories keeping their descriptions
            groupedByService[serviceName].push({
                categoria: cat.nombre,
                descripcion: cat.descripcion || '',
                subcategorias: cat.subcategorias.map((s: any) => ({ nombre: s.nombre, descripcion: s.descripcion || '' }))
            });
        });

        // Flatten the hierarchy to prevent LLM from hallucinating parents
        for (const service in groupedByService) {
            groupedByService[service].forEach((cat: any) => {
                if (cat.subcategorias && cat.subcategorias.length > 0) {
                    cat.subcategorias.forEach((sub: any) => {
                        markdownList += `\nRUTA: [Servicio: ${service}] -> [Categoría: ${cat.categoria}] -> [Subcategoría: ${sub.nombre}]`;
                        if (sub.descripcion) markdownList += ` (Contexto: ${sub.descripcion})`;
                    });
                } else {
                    markdownList += `\nRUTA: [Servicio: ${service}] -> [Categoría: ${cat.categoria}] -> [Subcategoría: N/A]`;
                }
                if (cat.descripcion) markdownList += ` (Contexto de Categoría: ${cat.descripcion})`;
            });
        }
        markdownList += '\n';

        this.currentSystemPrompt = this.baseSystemPrompt + '\n\nLISTA DE SERVICIOS Y CATEGORÍAS VÁLIDAS (NO USES NINGUNA OTRA):\n' + markdownList;
      },
      error: (err) => {
        console.error('Error fetching categories for RafaIA', err);
        this.currentSystemPrompt = this.baseSystemPrompt;
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  startNewChat() {
    const greeting = '¡Hola!, Describe detalladamente tu solicitud y te orientaré sobre el servicio a quien debes dirigir tu caso, así como la categoría y subcategoría que debes seleccionar.';
    this.chatMessages = [
      { role: 'assistant', content: greeting, formattedContent: this.formatMarkdown(greeting) }
    ];
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    let formatted = text;
    formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/_([^_]+)_/g, '<em>$1</em>');
    formatted = formatted.replace(/^- (.*)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isChatLoading) return;

    const userMessage = this.userInput;
    this.chatMessages.push({ role: 'user', content: userMessage, formattedContent: this.formatMarkdown(userMessage) });
    this.userInput = '';
    this.isChatLoading = true;

    try {
      // LLAMADA 1: Clasificación estricta (Temperatura 0.0)
      const apiMessages1 = [
        { role: 'system', content: this.currentSystemPrompt || this.baseSystemPrompt },
        ...this.chatMessages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      const response1 = await this.rafaIaService.sendMessage(apiMessages1, 'mesa_casos', { temperature: 0.0, num_ctx: 4096 }).toPromise();

      let responseContent1 = '';
      if (response1 && response1.choices && response1.choices.length > 0) {
        responseContent1 = response1.choices[0].message.content;
      } else if (response1 && response1.message) {
        responseContent1 = response1.message.content;
      }

      if (responseContent1) {
        this.chatMessages.push({
          role: 'assistant',
          content: responseContent1,
          formattedContent: this.formatMarkdown(responseContent1)
        });
        this.scrollToBottom();
      }
    } catch (error: any) {
      console.error('Error connecting to AI:', error);
      const errorMsg = `Lo siento, en este momento no puedo conectarme con mi motor local.`;
      this.chatMessages.push({ role: 'assistant', content: errorMsg, formattedContent: errorMsg });
    } finally {
      this.isChatLoading = false;
    }
  }
}
