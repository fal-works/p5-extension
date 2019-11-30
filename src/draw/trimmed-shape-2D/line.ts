import { p } from "../../shared";

/**
 * Draws a trimmed line between [`x1`, `y1`] and [`x2`, `y2`] using the given trimming ratios.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param startRatio - A number between 0 and 1.
 * @param endRatio - A number between 0 and 1.
 */
export const draw = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  startRatio: number,
  endRatio: number
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  p.line(
    x1 + startRatio * dx,
    y1 + startRatio * dy,
    x1 + endRatio * dx,
    y1 + endRatio * dy
  );
};

/**
 * Creates a function that draws a trimmed line between [`x1`, `y1`] and [`x2`, `y2`].
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns A new drawing function.
 */
export const create = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return (startRatio: number, endRatio: number) =>
    p.line(
      x1 + startRatio * dx,
      y1 + startRatio * dy,
      x1 + endRatio * dx,
      y1 + endRatio * dy
    );
};
