import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Root application shell — router outlet only; theme initializes via ThemeService.
 */
@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: `<router-outlet />`,
})
export class AppComponent {}
