import { TWO_PI } from "../../ccc";
import { p } from "../../shared";

type ArcMode = "chord" | "pie" | "open";

/**
 * Draws a trimmed ellipse at [`x`, `y`] using the given size and trimming ratios.
 * @param x
 * @param y
 * @param sizeX
 * @param sizeY
 * @param startRatio - A number between 0 and 1.
 * @param endRatio - A number between 0 and 1.
 * @param mode - Either `CHORD`, `PIE` or `OPEN`.
 * @param detail - For WebGL only. Defaults to `25`.
 */
export const draw = (
  x: number,
  y: number,
  sizeX: number,
  sizeY: number,
  startRatio: number,
  endRatio: number,
  mode?: ArcMode,
  detail?: number
) => {
  if (startRatio === endRatio) return;

  p.arc(
    x,
    y,
    sizeX,
    sizeY,
    startRatio * TWO_PI,
    endRatio * TWO_PI,
    mode,
    detail
  );
};

/**
 * Creates a function that draws a trimmed ellipse at [`x`, `y`] with the given size.
 * @param x
 * @param y
 * @param sizeX
 * @param sizeY
 * @param mode - Either `CHORD`, `PIE` or `OPEN`.
 * @param detail - For WebGL only. Defaults to `25`.
 * @returns A new drawing function.
 */
export const create = (
  x: number,
  y: number,
  sizeX: number,
  sizeY: number,
  mode?: ArcMode,
  detail?: number
) => (startRatio: number, endRatio: number) =>
  draw(x, y, sizeX, sizeY, startRatio, endRatio, mode, detail);
