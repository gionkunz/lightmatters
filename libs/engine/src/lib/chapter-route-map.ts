/**
 * Locked v1.0 journey map: topic slug → live `/chapter/N` route number.
 * Single source of truth for in-narration cross-references and guard tests.
 */
export const CHAPTER_ROUTE_BY_TOPIC = {
  'position-time': 1,
  'speed-of-light': 2,
  'speed-budget': 3,
  'light-information': 4,
  'ether-was-wrong': 5,
  'constant-c': 6,
  'clocks-and-rulers': 7,
  doppler: 8,
  'twin-paradox': 9,
  'mass-energy': 10,
  'rolling-diagram': 11,
  'gravity-well': 12,
  'light-bending': 13,
} as const;

export type ChapterTopicSlug = keyof typeof CHAPTER_ROUTE_BY_TOPIC;

export const CHAPTER_MIN = 1;
export const CHAPTER_MAX = 13;

/** All live journey route numbers in topic order (1–13). */
export const CHAPTER_ROUTE_NUMBERS = Object.values(
  CHAPTER_ROUTE_BY_TOPIC,
) as ChapterRouteNumber[];

export type ChapterRouteNumber =
  (typeof CHAPTER_ROUTE_BY_TOPIC)[ChapterTopicSlug];

export function getChapterRouteForTopic(topic: ChapterTopicSlug): number {
  return CHAPTER_ROUTE_BY_TOPIC[topic];
}
