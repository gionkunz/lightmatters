import { Routes } from '@angular/router';
import { LmChapterShellComponent } from '@lm/engine';
import { StepPageComponent } from './step-page.component';

export const chapter06ClocksRoutes: Routes = [
  {
    path: '',
    component: LmChapterShellComponent,
    children: [
      { path: 'step/:step', component: StepPageComponent },
      { path: '', redirectTo: 'step/1', pathMatch: 'full' },
    ],
  },
];
