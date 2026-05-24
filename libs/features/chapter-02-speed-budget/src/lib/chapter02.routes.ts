import { Routes } from '@angular/router';
import { ChapterShellComponent } from './chapter-shell.component';
import { StepPageComponent } from './step-page.component';

export const chapter02Routes: Routes = [
  {
    path: '',
    component: ChapterShellComponent,
    children: [
      { path: 'step/:step', component: StepPageComponent },
      { path: '', redirectTo: 'step/1', pathMatch: 'full' },
    ],
  },
];
