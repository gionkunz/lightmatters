export interface DerivationFrame {
  latex: string;
  /** Token ids to cancel when transitioning to the next frame. */
  cancel?: string[];
}

export interface TokenRect {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CancelVisualState {
  tint: number;
  strike: number;
  fade: number;
  collapse: number;
}
