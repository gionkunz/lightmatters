import type { AnimatableTarget } from './types';

export class TargetRegistry {
  private readonly targets = new Map<string, AnimatableTarget>();

  register(name: string, target: AnimatableTarget): void {
    this.targets.set(name, target);
  }

  get(name: string): AnimatableTarget | undefined {
    return this.targets.get(name);
  }

  resetAll(): void {
    for (const target of this.targets.values()) {
      target.set(target.initial ?? 0);
    }
  }

  clear(): void {
    this.targets.clear();
  }
}
