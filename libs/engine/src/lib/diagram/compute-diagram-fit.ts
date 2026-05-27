/** Largest axis-aligned box with given aspect ratio inside a container. */
export function computeDiagramFit(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number,
  minSize = 120,
): { width: number; height: number } {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { width: minSize, height: minSize };
  }

  let width: number;
  let height: number;
  if (containerWidth / containerHeight > aspectRatio) {
    height = containerHeight;
    width = height * aspectRatio;
  } else {
    width = containerWidth;
    height = width / aspectRatio;
  }

  return {
    width: Math.max(minSize, Math.floor(width)),
    height: Math.max(minSize, Math.floor(height)),
  };
}
