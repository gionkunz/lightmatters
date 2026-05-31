import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LmFeedbackFabComponent,
  LmViewportResolutionHintComponent,
} from '@lm/design';

/**
 * Root application shell — router outlet and global chrome; theme via ThemeService.
 */
@Component({
  imports: [
    RouterModule,
    LmViewportResolutionHintComponent,
    LmFeedbackFabComponent,
  ],
  selector: 'app-root',
  template: `
    <router-outlet />
    <lm-viewport-resolution-hint />
    <lm-feedback-fab />
  `,
})
export class AppComponent {}
