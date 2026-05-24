import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Lazy chapter route host — single router-outlet wrapper shared by all chapters. */
@Component({
  selector: 'lm-chapter-shell',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class LmChapterShellComponent {}
