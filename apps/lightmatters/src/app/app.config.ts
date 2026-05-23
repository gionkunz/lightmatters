import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { ThemeService } from '@org/design';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        inject(ThemeService);
        return () => undefined;
      },
    },
  ],
};
