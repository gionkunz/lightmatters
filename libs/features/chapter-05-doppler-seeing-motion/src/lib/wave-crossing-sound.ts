import type { AudioService } from '@lm/design';
import type { LightSceneObserver, LightSceneReception } from '@lm/light-scene';

/** Scene time farther than this past `atTime` is treated as a seek/skip jump (silent). */
const RECEPTION_SOUND_MAX_LAG = 0.15;
const DEFAULT_ARRIVAL_VOLUME = 0.55;

/** Play unless the scene clock jumped far past the arrival (checkpoint skip). */
export function shouldPlayWaveCrossingSound(
  sceneTime: number,
  atTime: number,
): boolean {
  return sceneTime - atTime <= RECEPTION_SOUND_MAX_LAG;
}

/** Map observer horizontal scene position to stereo pan. */
export function panFromObserverX(x: number): number {
  return Math.max(-1, Math.min(1, x / 0.75));
}

export function playObserverWaveCrossingSound(
  audio: AudioService,
  event: LightSceneReception,
  sceneTime: number,
  observers: readonly LightSceneObserver[],
  volume = DEFAULT_ARRIVAL_VOLUME,
): void {
  if (!shouldPlayWaveCrossingSound(sceneTime, event.atTime)) {
    return;
  }

  const observer = observers.find((o) => o.id === event.observerId);
  const pan = observer ? panFromObserverX(observer.x) : 0;
  audio.play('tick', { volume, pan });
}
