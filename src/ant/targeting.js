export function classifyPoseFamily(target, viewportWidth) {
  const ratio = target.centerX / viewportWidth;

  if (ratio < 0.25) return 'left-far';
  if (ratio < 0.5) return 'left-near';
  if (ratio < 0.75) return 'right-near';
  return 'right-far';
}
