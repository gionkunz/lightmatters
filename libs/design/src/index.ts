export { ThemeService, type ThemeName } from './lib/theme/theme.service';
export {
  FeedbackContextService,
  type FeedbackStepContext,
} from './lib/feedback/feedback-context.service';
export {
  FeedbackService,
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
  type FeedbackSubmitInput,
  type FeedbackSubmitResult,
  type FeedbackPayload,
} from './lib/feedback/feedback.service';
export { LmFeedbackFabComponent } from './lib/components/lm-feedback-fab.component';
export { AudioService } from './lib/audio/audio.service';
export { type SoundType, type SoundPlayOptions } from './lib/audio/sound-types';
export {
  ViewportResolutionHintService,
  MIN_VIEWPORT_WIDTH,
  MIN_VIEWPORT_HEIGHT,
  isViewportUndersized,
} from './lib/viewport/viewport-resolution-hint.service';
export { LmViewportResolutionHintComponent } from './lib/components/lm-viewport-resolution-hint.component';
export { MathJaxService } from './lib/math/mathjax.service';
export { LmInteractiveDirective } from './lib/directives/lm-interactive.directive';
export { LmWordmarkComponent } from './lib/components/lm-wordmark.component';
export { LmKickerComponent } from './lib/components/lm-kicker.component';
export { LmButtonComponent } from './lib/components/lm-button.component';
export { LmThemeToggleComponent } from './lib/components/lm-theme-toggle.component';
export { LmAudioToggleComponent } from './lib/components/lm-audio-toggle.component';
export { LmSliderComponent } from './lib/components/lm-slider.component';
export { LmFactLineComponent } from './lib/components/lm-fact-line.component';
export { LmLegendComponent } from './lib/components/lm-legend.component';
export {
  LmPredictionChoiceComponent,
  type PredictionOption,
} from './lib/components/lm-prediction-choice.component';
export {
  LmDerivationComponent,
  type DerivationFrame,
} from './lib/components/lm-derivation.component';
