import * as Ellipse from "./ellipse";

type ArcMode = "chord" | "pie" | "open";

/**
 * Draws a trimmed circle at [`x`, `y`] using the given size and trimming ratios.
 * @param x
 * @param y
 * @param size
 * @param startRatio - A number between 0 and 1.
 * @param endRatio - A number between 0 and 1.
 * @param mode - Either `CHORD`, `PIE` or `OPEN`.
 * @param detail - For WebGL only. Defaults to `25`.
 */
export const draw = (
  x: number,
  y: number,
  size: number,
  startRatio: number,
  endRatio: number,
  mode?: ArcMode,
  detail?: number
) => Ellipse.draw(x, y, size, size, startRatio, endRatio, mode, detail);

/**
 * Creates a function that draws a trimmed circle at [`x`, `y`] with the given size.
 * @param x
 * @param y
 * @param size
 * @param mode - Either `CHORD`, `PIE` or `OPEN`.
 * @param detail - For WebGL only. Defaults to `25`.
 * @returns A new drawing function.
 */
export const create = (
  x: number,
  y: number,
  size: number,
  mode?: ArcMode,
  detail?: number
) => Ellipse.create(x, y, size, size, mode, detail);
