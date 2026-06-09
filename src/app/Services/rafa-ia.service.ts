import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_RAFA_IA_URL } from '../constantes';

export interface ChatMessage {
  role: string;
  content: string;
  files?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RafaIaService {
  private http = inject(HttpClient);

  /**
   * Enviar mensajes a la IA
   * @param messages Arreglo de mensajes previos y actuales
   * @param chatId ID de chat opcional para seguimiento
   * @returns Observable con la respuesta de la API
   */
  sendMessage(messages: ChatMessage[], chatId: string = 'apphusrt_chat'): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const systemMessage = {
      role: 'system',
      content: 'eres el asistente de inteligencia artificial oficial de los colaboradores administrativos y asistenciales del hospital universitario san rafael de tunja.'
    };

    const cleanMessages = messages.map(msg => ({ role: msg.role, content: msg.content }));
    const processedMessages = [systemMessage, ...cleanMessages];

    const payload = {
      model: 'llama3.1',
      messages: processedMessages,
      stream: false
    };

    return this.http.post<any>(API_RAFA_IA_URL, payload, { headers });
  }
}
