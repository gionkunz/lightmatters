import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@org/feature-landing').then((m) => m.landingRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
