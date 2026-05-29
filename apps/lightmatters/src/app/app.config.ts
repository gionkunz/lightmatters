import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AudioService, ThemeService } from '@lm/design';
import { setTimelineSoundSink } from '@lm/engine';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(),
    provideRouter(appRoutes),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        inject(ThemeService);
        const audio = inject(AudioService);
        setTimelineSoundSink(audio);
        return () => undefined;
      },
    },
  ],
};
