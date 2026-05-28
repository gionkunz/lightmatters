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
    path: 'ch/06',
    loadChildren: () =>
      import('@lm/feature-chapter-06-rolling-diagram').then(
        (m) => m.chapter06Routes,
      ),
  },
  {
    path: 'ch/07',
    loadChildren: () =>
      import('@lm/feature-chapter-07-gravity-well').then(
        (m) => m.chapter07Routes,
      ),
  },
  {
    path: 'ch/08',
    loadChildren: () =>
      import('@lm/feature-chapter-08-light-bending').then(
        (m) => m.chapter08Routes,
      ),
  },
  {
    path: 'ch/09/step/:step',
    loadComponent: () =>
      import('./chapter-09-placeholder.component').then(
        (m) => m.Chapter09PlaceholderComponent,
      ),
  },
  {
    path: 'ch/09',
    redirectTo: 'ch/09/step/1',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
