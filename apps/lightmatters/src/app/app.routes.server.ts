import { RenderMode, ServerRoute } from '@angular/ssr';
import {
  CHAPTER_01_STEPS,
  CHAPTER_02_STEPS,
  CHAPTER_03_STEPS,
  CHAPTER_04_STEPS,
  CHAPTER_05_STEPS,
  CHAPTER_06_STEPS,
  CHAPTER_07_STEPS,
  CHAPTER_08_STEPS,
  CHAPTER_09_STEPS,
  stepPrerenderParams,
} from './site-routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'ch/01/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_01_STEPS),
  },
  {
    path: 'ch/02/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_02_STEPS),
  },
  {
    path: 'ch/03/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_03_STEPS),
  },
  {
    path: 'ch/04/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_04_STEPS),
  },
  {
    path: 'ch/05/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_05_STEPS),
  },
  {
    path: 'ch/06/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_06_STEPS),
  },
  {
    path: 'ch/07/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_07_STEPS),
  },
  {
    path: 'ch/08/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_08_STEPS),
  },
  {
    path: 'ch/09/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_09_STEPS),
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
