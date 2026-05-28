import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@lm/feature-landing').then((m) => m.landingRoutes),
  },
  {
    path: 'chapter/1',
    loadChildren: () =>
      import('@lm/feature-chapter-01-position-time').then(
        (m) => m.chapter01Routes,
      ),
  },
  {
    path: 'chapter/2',
    loadChildren: () =>
      import('@lm/feature-chapter-02-speed-budget').then(
        (m) => m.chapter02Routes,
      ),
  },
  {
    path: 'chapter/3',
    loadChildren: () =>
      import('@lm/feature-chapter-03-light-information').then(
        (m) => m.chapter03Routes,
      ),
  },
  {
    path: 'chapter/4',
    loadChildren: () =>
      import('@lm/feature-chapter-04-ether-was-wrong').then(
        (m) => m.chapter04Routes,
      ),
  },
  {
    path: 'chapter/5/step/:step',
    loadComponent: () =>
      import('./chapter-coming-soon-placeholder.component').then(
        (m) => m.ChapterComingSoonPlaceholderComponent,
      ),
    data: {
      chapter: 5,
      title: 'The same speed of light',
      backHref: '/chapter/4/step/5',
      backLabel: '← back to chapter 4',
    },
  },
  {
    path: 'chapter/5',
    redirectTo: 'chapter/5/step/1',
    pathMatch: 'full',
  },
  {
    path: 'chapter/7',
    loadChildren: () =>
      import('@lm/feature-chapter-05-doppler-seeing-motion').then(
        (m) => m.chapter05Routes,
      ),
  },
  {
    path: 'chapter/10',
    loadChildren: () =>
      import('@lm/feature-chapter-06-rolling-diagram').then(
        (m) => m.chapter06Routes,
      ),
  },
  {
    path: 'chapter/11',
    loadChildren: () =>
      import('@lm/feature-chapter-07-gravity-well').then(
        (m) => m.chapter07Routes,
      ),
  },
  {
    path: 'chapter/12',
    loadChildren: () =>
      import('@lm/feature-chapter-08-light-bending').then(
        (m) => m.chapter08Routes,
      ),
  },
  {
    path: 'chapter/13/step/:step',
    loadComponent: () =>
      import('./chapter-13-placeholder.component').then(
        (m) => m.Chapter13PlaceholderComponent,
      ),
  },
  {
    path: 'chapter/13',
    redirectTo: 'chapter/13/step/1',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
