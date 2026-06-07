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
        tex: {
          inlineMath: [['\\(', '\\)']],
          displayMath: [],
        },
        options: {
          enableMenu: false,
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
