import { Injectable } from '@angular/core';
import type { MathJaxApi } from './mathjax.types';

const MATHJAX_SCRIPT = '/mathjax/tex-chtml-nofont.js';

export interface MathJaxTypesetTarget {
  element: HTMLElement;
  latex: string;
}

/** Lazy-loads MathJax and typesets inline LaTeX into CHTML. */
@Injectable({ providedIn: 'root' })
export class MathJaxService {
  private loading: Promise<void> | null = null;
  private readonly typesetInFlight = new WeakMap<HTMLElement, Promise<void>>();

  ensureReady(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    const existing = this.getApi()?.startup.promise;
    if (existing) {
      return existing;
    }

    if (!this.loading) {
      this.loading = this.loadMathJax();
    }

    return this.loading;
  }

  async typesetElement(element: HTMLElement, latex: string): Promise<void> {
    return this.typesetElements([{ element, latex }]);
  }

  async typesetElements(
    items: ReadonlyArray<MathJaxTypesetTarget>,
  ): Promise<void> {
    const pending = items.filter(
      ({ element, latex }) => latex.length > 0 && !this.isRendered(element),
    );
    if (pending.length === 0) {
      return;
    }

    await Promise.all(
      pending.map(({ element }) => this.typesetInFlight.get(element) ?? Promise.resolve()),
    );

    const toTypeset = pending.filter(
      ({ element }) =>
        !this.isRendered(element) && element.dataset['typeset'] !== 'pending',
    );
    if (toTypeset.length === 0) {
      return;
    }

    const work = this.typesetElementsInner(toTypeset);
    for (const { element } of toTypeset) {
      this.typesetInFlight.set(element, work);
    }

    try {
      await work;
    } finally {
      for (const { element } of toTypeset) {
        this.typesetInFlight.delete(element);
      }
    }
  }

  private async typesetElementsInner(
    items: ReadonlyArray<MathJaxTypesetTarget>,
  ): Promise<void> {
    await this.ensureReady();
    const api = this.getApi();
    if (!api) {
      return;
    }

    for (const { element, latex } of items) {
      element.textContent = `\\(${latex}\\)`;
      element.dataset['typeset'] = 'pending';
    }

    try {
      await api.typesetPromise(items.map(({ element }) => element));
      for (const { element } of items) {
        element.dataset['typeset'] = 'done';
      }
      return;
    } catch {
      for (const { element } of items) {
        delete element.dataset['typeset'];
      }
    }

    for (const { element, latex } of items) {
      if (this.isRendered(element)) {
        element.dataset['typeset'] = 'done';
        continue;
      }

      element.textContent = `\\(${latex}\\)`;
      element.dataset['typeset'] = 'pending';
      try {
        await api.typesetPromise([element]);
        element.dataset['typeset'] = 'done';
      } catch {
        delete element.dataset['typeset'];
        throw new Error(`MathJax failed to typeset: ${latex}`);
      }
    }
  }

  private isRendered(element: HTMLElement): boolean {
    return element.querySelector('mjx-container') !== null;
  }

  private getApi(): MathJaxApi | undefined {
    return window.MathJax as MathJaxApi | undefined;
  }

  private loadMathJax(): Promise<void> {
    return new Promise((resolve, reject) => {
      window.MathJax = {
        // Self-host the newcm font. The `-nofont` build ships no glyph data and
        // by default fetches it from jsdelivr (`loader.paths.fonts`). Overriding
        // the `mathjax-newcm` path keeps the font component, its on-demand
        // `chtml/dynamic/*` chunks, and the `chtml/woff2/*` files on our own
        // origin (copied to `public/mathjax/mathjax-newcm-font` by copy-mathjax),
        // so rendering no longer depends on an external CDN being reachable.
        loader: {
          paths: {
            'mathjax-newcm': '/mathjax/mathjax-newcm-font',
          },
        },
        tex: {
          inlineMath: [['\\(', '\\)']],
          displayMath: [],
        },
        options: {
          enableMenu: false,
          // MathJax 4 runs semantic enrichment + speech/Braille generation in a
          // Web Worker (the speech-rule engine) that relies on SharedArrayBuffer.
          // Without cross-origin isolation (COOP/COEP) that worker can hang, and
          // because `enrich`/`attachSpeech` are render actions in the typeset
          // pipeline, a single hang leaves typesetPromise unresolved forever and
          // poisons the document's typeset queue — every subsequent expression
          // then renders as raw `\(...\)` source.
          //
          // The `enableEnrichment`/`enableSpeech` flags are not enough: the menu
          // component re-applies its own stored settings over them. Instead we
          // remove the worker-backed render actions from the pipeline entirely
          // (an empty array disables a default action). We don't surface any of
          // this a11y metadata anyway, so this is also faster.
          renderActions: {
            enrich: [],
            attachSpeech: [],
            explorable: [],
            addMenu: [],
            getMenus: [],
          },
        },
        startup: {
          ready() {
            const mj = window.MathJax as MathJaxApi | undefined;
            mj?.startup.defaultReady();
          },
        },
      };

      const script = document.createElement('script');
      script.src = MATHJAX_SCRIPT;
      script.async = true;
      script.onload = () => {
        const promise = this.getApi()?.startup.promise;
        if (!promise) {
          reject(new Error('MathJax startup promise missing'));
          return;
        }
        promise.then(resolve).catch(reject);
      };
      script.onerror = () => reject(new Error('MathJax script failed to load'));
      document.head.appendChild(script);
    });
  }
}
