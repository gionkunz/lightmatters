import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lm-chapter-shell',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class ChapterShellComponent {}
