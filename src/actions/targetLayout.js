export function getActionTargetMeta(button) {
  const rect = button.getBoundingClientRect();

  return {
    id: button.dataset.actionId,
    rect,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}
