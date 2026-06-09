import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RafaIaService } from '../../Services/rafa-ia.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rafa-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rafa-ia.component.html',
  styleUrl: './rafa-ia.component.css'
})
export class RafaIaComponent implements OnInit, AfterViewChecked {
  private rafaIaService = inject(RafaIaService);
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  chatMessages: { role: string, content: string, formattedContent?: string }[] = [];
  userInput: string = '';
  isChatLoading: boolean = false;
  sidebarOpen: boolean = true;
  
  private systemPrompt = `Eres Rafa IA, el asistente inteligente y experto de ORBIX, el portal institucional del Hospital Universitario San Rafael de Tunja (HUSRT). Tu tono es amable, profesional, servicial y empático. Responde siempre en español usando formato Markdown para dar estilo a tus respuestas (negritas, viñetas, bloques de código, etc.). Nunca inventes información sobre el hospital si no la sabes.`;
  
  ngOnInit() {
    this.startNewChat();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  startNewChat() {
    this.chatMessages = [
      { role: 'assistant', content: '¡Hola! Soy Rafa, tu Asistente Inteligente ORBIX. ¿En qué puedo ayudarte el día de hoy?', formattedContent: '¡Hola! Soy Rafa, tu Asistente Inteligente ORBIX. ¿En qué puedo ayudarte el día de hoy?' }
    ];
    setTimeout(() => this.resetTextarea(), 0);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
    textarea.style.height = (textarea.scrollHeight < 200 ? textarea.scrollHeight : 200) + 'px';
  }

  resetTextarea() {
    const textarea = document.querySelector('.input-box textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
    }
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    let formatted = text;
    
    // Escapar HTML básico para seguridad
    formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Bloques de código multilínea (```código```)
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
    // Código en línea (`código`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Negrita (**texto**)
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Cursiva (*texto* o _texto_)
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/_([^_]+)_/g, '<em>$1</em>');
    // Listas con viñetas básicas (- elemento)
    formatted = formatted.replace(/^- (.*)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Saltos de línea
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Eliminar saltos extras dentro de bloques de código y listas
    formatted = formatted.replace(/<pre([^>]*)><br>/g, '<pre$1>');
    formatted = formatted.replace(/<\/ul><br>/g, '</ul>');
    
    return formatted;
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      // Opcionalmente podrías agregar un Toast o alerta aquí.
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
      // Preparamos el payload incluyendo el system prompt
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
      const errorMsg = `Lo siento, en este momento no puedo conectarme con mi motor local. (Error HTTP: ${error.status} - ${error.statusText || 'Desconocido'}. Mensaje: ${error.message})`;
      this.chatMessages.push({ role: 'assistant', content: errorMsg, formattedContent: errorMsg });
    } finally {
      this.isChatLoading = false;
    }
  }
}
