import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_PUZZLE: Step = {
  id: 'the-puzzle',
  title: 'The puzzle',
  kicker: 'a question from childhood',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Have you ever wondered what would happen if you dug a straight tunnel through the Earth and jumped in?',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'You would fall — but toward what? If gravity pulls everything toward the center of the Earth, is gravity **strongest** there? Or on the **surface**, where we stand?',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And at the very center — would you be crushed by the pull from every direction, or would something else happen entirely?',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'In Chapter 11 we bent the paper into a **cone** — gravity as geometry, not a force. Epstein\'s next move is surprising: the full picture is not a **well** that dips down, but a **bulge** that swells outward.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Unfold that bulge and free fall is a **straight line** on the paper. Next we build it piece by piece — two cylinders, two cones, and Earth at the center.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
