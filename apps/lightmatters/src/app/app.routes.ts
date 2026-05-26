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
    path: 'ch/03',
    loadChildren: () =>
      import('@lm/feature-chapter-03-light-information').then(
        (m) => m.chapter03Routes,
      ),
  },
  {
    path: 'ch/04',
    loadChildren: () =>
      import('@lm/feature-chapter-04-ether-was-wrong').then(
        (m) => m.chapter04Routes,
      ),
  },
  {
    path: 'ch/05',
    loadChildren: () =>
      import('@lm/feature-chapter-05-doppler-seeing-motion').then(
        (m) => m.chapter05Routes,
      ),
  },
  {
    path: 'ch/06/step/:step',
    loadComponent: () =>
      import('./chapter-06-placeholder.component').then(
        (m) => m.Chapter06PlaceholderComponent,
      ),
  },
  {
    path: 'ch/06',
    redirectTo: 'ch/06/step/1',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
