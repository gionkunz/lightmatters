export interface MathJaxStartup {
  defaultReady(): void;
  promise: Promise<void>;
}

export interface MathJaxApi {
  startup: MathJaxStartup;
  typesetPromise(elements?: Element[]): Promise<void>;
}

declare global {
  interface Window {
    MathJax?: {
      loader?: {
        paths?: Record<string, string>;
      };
      tex?: {
        inlineMath?: string[][];
        displayMath?: string[][];
      };
      options?: {
        enableMenu?: boolean;
        renderActions?: Record<string, unknown[]>;
      };
      startup?: {
        ready?: () => void;
        promise?: Promise<void>;
      };
    };
  }
}

export {};
