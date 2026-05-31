import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathJaxService } from '../math/mathjax.service';
import { LmDerivationComponent } from './lm-derivation.component';
import type { DerivationFrame } from './lm-derivation.types';
import {
  applyCancelStyles,
  cancelVisualState,
  measureTokenRects,
  queryTokenNodes,
} from './lm-derivation.utils';

const FRAMES: DerivationFrame[] = [
  {
    latex: String.raw`\cssId{M}{M}\cdot\frac{EL}{\cssId{Mc2}{Mc^2}} = \cssId{m}{m}\cdot \cssId{L}{L}`,
    cancel: ['M', 'L'],
  },
  {
    latex: String.raw`\cssId{m}{m} = \frac{\cssId{E}{E}}{c^2}`,
  },
];

function typesetTaggedHtml(latex: string): string {
  const tags: Record<string, string> = {
    [String.raw`\cssId{M}{M}\cdot\frac{EL}{\cssId{Mc2}{Mc^2}} = \cssId{m}{m}\cdot \cssId{L}{L}`]:
      '<span id="M">M</span><span>·</span><span id="Mc2">Mc²</span><span>=</span><span id="m">m</span><span>·</span><span id="L">L</span>',
    [String.raw`\cssId{m}{m} = \frac{\cssId{E}{E}}{c^2}`]:
      '<span id="m">m</span><span>=</span><span id="E">E</span><span>/c²</span>',
  };
  return tags[latex] ?? latex;
}

describe('LmDerivationComponent', () => {
  let fixture: ComponentFixture<LmDerivationComponent>;
  let mathJax: jest.Mocked<Pick<MathJaxService, 'typesetElement' | 'ensureReady'>>;

  beforeEach(async () => {
    mathJax = {
      ensureReady: jest.fn().mockResolvedValue(undefined),
      typesetElement: jest.fn(async (element: HTMLElement, latex: string) => {
        element.innerHTML = typesetTaggedHtml(latex);
        element.dataset['typeset'] = 'done';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [LmDerivationComponent],
      providers: [{ provide: MathJaxService, useValue: mathJax }],
    }).compileComponents();

    (window as Window & { MathJax?: object }).MathJax = {};

    fixture = TestBed.createComponent(LmDerivationComponent);
    fixture.componentRef.setInput('frames', FRAMES);
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as Window & { MathJax?: object }).MathJax;
  });

  async function flushRender(): Promise<void> {
    fixture.detectChanges();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();
  }

  it('renders the first frame at playhead 0', async () => {
    fixture.componentRef.setInput('playhead', 0);
    await flushRender();

    const stage = fixture.nativeElement.querySelector(
      '[data-testid="derivation-stage"]',
    ) as HTMLElement;
    expect(stage.textContent).toContain('M');
    expect(stage.querySelector('#m')).toBeTruthy();
  });

  it('renders the final frame when playhead is at max (skip-to-result)', async () => {
    fixture.componentRef.setInput('playhead', 0);
    await flushRender();

    fixture.componentRef.setInput('playhead', 1);
    await flushRender();

    const stage = fixture.nativeElement.querySelector(
      '[data-testid="derivation-stage"]',
    ) as HTMLElement;
    expect(stage.querySelector('#E')).toBeTruthy();
    expect(stage.textContent).toContain('m');
    expect(stage.querySelector('#M')).toBeFalsy();
    expect(stage.querySelector('#L')).toBeFalsy();
  });

  it('creates token overlays for move, enter, and cancel during transition', async () => {
    fixture.componentRef.setInput('playhead', 0);
    await flushRender();

    fixture.componentRef.setInput('playhead', 0.5);
    await flushRender();

    const overlay = fixture.nativeElement.querySelector(
      '.lm-derivation__overlay',
    ) as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.querySelectorAll('[style*="absolute"]').length).toBeGreaterThan(0);
  });

  it('loads MathJax via ensureReady when it is absent at first render', async () => {
    delete (window as Window & { MathJax?: object }).MathJax;

    const lateMathJax = {
      ensureReady: jest.fn(async () => {
        // Mirror the real service: MathJax becomes available only after loading.
        (window as Window & { MathJax?: object }).MathJax = {};
      }),
      typesetElement: jest.fn(async (element: HTMLElement, latex: string) => {
        element.innerHTML = typesetTaggedHtml(latex);
        element.dataset['typeset'] = 'done';
      }),
    };

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [LmDerivationComponent],
        providers: [{ provide: MathJaxService, useValue: lateMathJax }],
      })
      .compileComponents();

    const lateFixture = TestBed.createComponent(LmDerivationComponent);
    lateFixture.componentRef.setInput('frames', FRAMES);
    lateFixture.componentRef.setInput('playhead', 0);
    for (let i = 0; i < 6; i++) {
      lateFixture.detectChanges();
      await Promise.resolve();
    }
    lateFixture.detectChanges();

    expect(lateMathJax.ensureReady).toHaveBeenCalled();
    const stage = lateFixture.nativeElement.querySelector(
      '[data-testid="derivation-stage"]',
    ) as HTMLElement;
    expect(stage.querySelector('#m')).toBeTruthy();
  });

  it('shows static fallback before client MathJax is ready', () => {
    delete (window as Window & { MathJax?: object }).MathJax;
    fixture = TestBed.createComponent(LmDerivationComponent);
    fixture.componentRef.setInput('frames', FRAMES);
    fixture.componentRef.setInput('playhead', 0);
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector(
      '[data-testid="derivation-fallback"]',
    ) as HTMLElement;
    expect(fallback.textContent).toContain(String.raw`\cssId{M}{M}`);
  });
});

describe('lm-derivation utils', () => {
  it('queries cssId-tagged token nodes after typeset', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<span id="M">M</span><span id="L">L</span><span id="m">m</span>';

    const nodes = queryTokenNodes(root);
    expect(nodes.get('M')?.textContent).toBe('M');
    expect(nodes.get('L')?.textContent).toBe('L');
    expect(nodes.size).toBe(3);
  });

  it('measures token rects relative to a stage', () => {
    const stage = document.createElement('div');
    stage.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 20,
        width: 200,
        height: 40,
        right: 210,
        bottom: 60,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      }) as DOMRect;

    const root = document.createElement('div');
    const token = document.createElement('span');
    token.id = 'E';
    token.textContent = 'E';
    token.getBoundingClientRect = () =>
      ({
        left: 50,
        top: 30,
        width: 12,
        height: 16,
        right: 62,
        bottom: 46,
        x: 50,
        y: 30,
        toJSON: () => ({}),
      }) as DOMRect;
    root.appendChild(token);

    const rects = measureTokenRects(root, stage.getBoundingClientRect());
    expect(rects.get('E')).toEqual({
      id: 'E',
      left: 40,
      top: 10,
      width: 12,
      height: 16,
    });
  });

  it('applies cancel tint, strike, fade, and collapse phases', () => {
    const token = document.createElement('span');
    token.textContent = 'M';

    applyCancelStyles(token, cancelVisualState(0.1));
    expect(token.style.color).toContain('color-mix');
    expect(token.style.opacity).toBe('1');

    applyCancelStyles(token, cancelVisualState(0.9));
    expect(Number.parseFloat(token.style.opacity)).toBeLessThan(0.2);
    expect(token.querySelector('.lm-derivation-strike')).toBeTruthy();
    expect(token.style.transform).toMatch(/scaleX\(0\./);
  });
});

describe('LmDerivationComponent prerender no-op', () => {
  it('does not call MathJax when window is undefined', async () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate prerender environment
    delete globalThis.window;

    const mathJax = {
      ensureReady: jest.fn().mockResolvedValue(undefined),
      typesetElement: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LmDerivationComponent],
      providers: [{ provide: MathJaxService, useValue: mathJax }],
    }).compileComponents();

    globalThis.window = originalWindow;
  });
});
