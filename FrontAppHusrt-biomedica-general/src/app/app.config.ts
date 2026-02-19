import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MyPreset } from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService ,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({theme:{preset:MyPreset, options: {
            darkModeSelector: false || 'none'
        }}}),
    provideAnimations(),
    provideHttpClient(),
    provideClientHydration(withEventReplay())]
};
