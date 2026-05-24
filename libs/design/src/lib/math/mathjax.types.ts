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
      tex?: {
        inlineMath?: string[][];
        displayMath?: string[][];
      };
      options?: {
        enableMenu?: boolean;
      };
      startup?: {
        ready?: () => void;
        promise?: Promise<void>;
      };
    };
  }
}

export {};
