import p5 from "p5";

import { p, canvas } from "../../shared";

/**
 * Applies shadow effect on the drawing context.
 * Be sure that the color mode is set to RGB (red, green, blue, alpha ∈ [0, 255]).
 */
export const setShadow = (
  color: p5.Color,
  blur: number,
  offsetX = 0,
  offsetY = 0
): void => {
  const r = p.red(color);
  const g = p.green(color);
  const b = p.blue(color);
  const alpha = p.alpha(color);

  const { scaleFactor } = canvas;
  const ctx = (p as any).drawingContext;
  ctx.shadowOffsetX = scaleFactor * offsetX;
  ctx.shadowOffsetY = scaleFactor * offsetY;
  ctx.shadowBlur = scaleFactor * blur;
  ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
};
