import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type BroadcastMessage =
  | { type: 'SESSION_REQUEST' }
  | { type: 'SESSION_RESPONSE'; token: string; idUser: string | null; rol: string | null }
  | { type: 'SESSION_LOGOUT' };

/**
 * SessionSyncService
 *
 * Permite sincronizar la sesión JWT entre pestañas del mismo origen usando
 * la BroadcastChannel API. Esto resuelve el problema de que al abrir un
 * vínculo en una nueva pestaña (right-click → "Abrir en nueva pestaña"),
 * la nueva pestaña hereda automáticamente la sesión de la pestaña origen
 * sin necesidad de volver a hacer login.
 *
 * Flujo:
 *  1. Nueva pestaña abre con sessionStorage vacío.
 *  2. AppComponent llama a requestSessionFromOtherTabs().
 *  3. Este servicio emite SESSION_REQUEST por BroadcastChannel.
 *  4. Pestañas existentes reciben el mensaje y responden con SESSION_RESPONSE.
 *  5. La nueva pestaña recibe el token y lo guarda en su sessionStorage.
 *  6. La nueva pestaña continúa con sesión válida. ✅
 */
@Injectable({
  providedIn: 'root'
})
export class SessionSyncService {

  private channel: BroadcastChannel | null = null;
  private platformId = inject(PLATFORM_ID);

  /** Tiempo máximo de espera para obtener respuesta de otra pestaña (ms) */
  private readonly REQUEST_TIMEOUT_MS = 400;

  private readonly CHANNEL_NAME = 'husrt_session_channel';

  constructor() {
    if (isPlatformBrowser(this.platformId) && typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(this.CHANNEL_NAME);
      this.listenForRequests();
    }
  }

  /**
   * Escucha peticiones de sesión de otras pestañas.
   * Si esta pestaña tiene un token válido, responde con él.
   */
  private listenForRequests(): void {
    if (!this.channel) return;

    this.channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const msg = event.data;

      if (msg.type === 'SESSION_REQUEST') {
        // Otra pestaña está pidiendo nuestra sesión
        const token = sessionStorage.getItem('utoken');
        if (token) {
          this.channel!.postMessage({
            type: 'SESSION_RESPONSE',
            token,
            idUser: sessionStorage.getItem('idUser'),
            rol: sessionStorage.getItem('rol')
          } as BroadcastMessage);
        }
      }
    };
  }

  /**
   * Solicita la sesión activa a otras pestañas abiertas.
   * Solo actúa si sessionStorage está vacío (nueva pestaña sin sesión).
   *
   * @returns Promise<boolean> — true si se recibió y aplicó una sesión.
   */
  requestSessionFromOtherTabs(): Promise<boolean> {
    return new Promise((resolve) => {
      // Si ya tenemos sesión, no necesitamos pedir nada
      if (sessionStorage.getItem('utoken')) {
        resolve(false);
        return;
      }

      // Si no hay BroadcastChannel disponible, continuar sin sesión
      if (!this.channel) {
        resolve(false);
        return;
      }

      let settled = false;

      const responseHandler = (event: MessageEvent<BroadcastMessage>) => {
        if (event.data.type === 'SESSION_RESPONSE' && !settled) {
          settled = true;
          this.channel!.removeEventListener('message', responseHandler);

          const { token, idUser, rol } = event.data;
          if (token) {
            sessionStorage.setItem('utoken', token);
            if (idUser) sessionStorage.setItem('idUser', idUser);
            if (rol) sessionStorage.setItem('rol', rol);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      };

      this.channel.addEventListener('message', responseHandler);

      // Solicitar sesión a pestañas existentes
      this.channel.postMessage({ type: 'SESSION_REQUEST' } as BroadcastMessage);

      // Timeout: si nadie responde, continuar sin sesión (usuario puede hacer login)
      setTimeout(() => {
        if (!settled) {
          settled = true;
          this.channel!.removeEventListener('message', responseHandler);
          resolve(false);
        }
      }, this.REQUEST_TIMEOUT_MS);
    });
  }

  /**
   * Emite un evento de logout a todas las pestañas abiertas.
   * Usar con precaución: cierra la sesión en TODAS las pestañas.
   */
  broadcastLogout(): void {
    if (this.channel) {
      this.channel.postMessage({ type: 'SESSION_LOGOUT' } as BroadcastMessage);
    }
  }

  /**
   * Suscribe un callback para reaccionar al logout broadcast de otras pestañas.
   */
  onBroadcastLogout(callback: () => void): void {
    if (!this.channel) return;

    const handler = (event: MessageEvent<BroadcastMessage>) => {
      if (event.data.type === 'SESSION_LOGOUT') {
        callback();
      }
    };

    this.channel.addEventListener('message', handler);
  }
}
