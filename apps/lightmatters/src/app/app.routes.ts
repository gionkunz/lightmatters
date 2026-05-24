import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@lm/feature-landing').then((m) => m.landingRoutes),
  },
  {
    path: 'ch/01',
    loadChildren: () =>
      import('@lm/feature-chapter-01-position-time').then(
        (m) => m.chapter01Routes,
      ),
  },
  {
    path: 'ch/02',
    loadChildren: () =>
      import('@lm/feature-chapter-02-speed-budget').then(
        (m) => m.chapter02Routes,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
