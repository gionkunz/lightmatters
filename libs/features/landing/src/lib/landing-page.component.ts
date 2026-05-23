import { Component } from '@angular/core';
import { LandingChaptersComponent } from './sections/landing-chapters.component';
import { LandingCtaComponent } from './sections/landing-cta.component';
import { LandingFooterComponent } from './sections/landing-footer.component';
import { LandingHeroComponent } from './sections/landing-hero.component';
import { LandingManifestoComponent } from './sections/landing-manifesto.component';
import { LandingNavComponent } from './sections/landing-nav.component';
import { LandingPrinciplesComponent } from './sections/landing-principles.component';

@Component({
  selector: 'lm-landing-page',
  imports: [
    LandingNavComponent,
    LandingHeroComponent,
    LandingManifestoComponent,
    LandingChaptersComponent,
    LandingPrinciplesComponent,
    LandingCtaComponent,
    LandingFooterComponent,
  ],
  template: `
    <div class="w-full bg-paper text-ink transition-colors duration-400">
      <lm-landing-nav />
      <lm-landing-hero />
      <lm-landing-manifesto />
      <lm-landing-chapters />
      <lm-landing-principles />
      <lm-landing-cta />
      <lm-landing-footer />
    </div>
  `,
})
export class LandingPageComponent {}
