import { Injectable } from '@angular/core';
import type { MathJaxApi } from './mathjax.types';

const MATHJAX_SCRIPT = '/mathjax/tex-chtml-nofont.js';

/** Lazy-loads MathJax and typesets inline LaTeX into CHTML. */
@Injectable({ providedIn: 'root' })
export class MathJaxService {
  private loading: Promise<void> | null = null;

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
    await this.ensureReady();
    const api = this.getApi();
    if (!api) {
      return;
    }

    element.textContent = `\\(${latex}\\)`;
    element.dataset['typeset'] = 'pending';
    await api.typesetPromise([element]);
    element.dataset['typeset'] = 'done';
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
