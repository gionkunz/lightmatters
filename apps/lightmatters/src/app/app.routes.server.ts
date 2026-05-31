import { RenderMode, ServerRoute } from '@angular/ssr';
import {
  CHAPTER_01_STEPS,
  CHAPTER_02_SPEED_OF_LIGHT_STEPS,
  CHAPTER_02_STEPS,
  CHAPTER_03_STEPS,
  CHAPTER_04_STEPS,
  CHAPTER_05_CONSTANT_C_STEPS,
  CHAPTER_05_STEPS,
  CHAPTER_06_CLOCKS_STEPS,
  CHAPTER_06_STEPS,
  CHAPTER_07_STEPS,
  CHAPTER_08_STEPS,
  CHAPTER_08_TWIN_STEPS,
  CHAPTER_09_MASS_ENERGY_STEPS,
  CHAPTER_14_STEPS,
  stepPrerenderParams,
} from './site-routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'chapter/1/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_01_STEPS),
  },
  {
    path: 'chapter/2/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_02_SPEED_OF_LIGHT_STEPS),
  },
  {
    path: 'chapter/3/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_02_STEPS),
  },
  {
    path: 'chapter/4/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_03_STEPS),
  },
  {
    path: 'chapter/5/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_04_STEPS),
  },
  {
    path: 'chapter/6/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_05_CONSTANT_C_STEPS),
  },
  {
    path: 'chapter/7/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_06_CLOCKS_STEPS),
  },
  {
    path: 'chapter/8/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_05_STEPS),
  },
  {
    path: 'chapter/9/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_08_TWIN_STEPS),
  },
  {
    path: 'chapter/10/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_09_MASS_ENERGY_STEPS),
  },
  {
    path: 'chapter/11/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_06_STEPS),
  },
  {
    path: 'chapter/12/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_07_STEPS),
  },
  {
    path: 'chapter/13/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_08_STEPS),
  },
  {
    path: 'chapter/14/step/:step',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: stepPrerenderParams(CHAPTER_14_STEPS),
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
