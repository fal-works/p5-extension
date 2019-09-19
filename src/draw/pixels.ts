import p5 from "p5";
import { p } from "../shared";

/**
 * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
 * The style and transformations will be restored by using `p.push()` and `p.pop()`.
 * @param p The p5 instance.
 * @param drawCallback
 * @return Pixels of the canvas after applying `drawCallback`.
 */
export const createPixels = (drawCallback: () => void | p5): number[] => {
  p.push();
  drawCallback();
  p.pop();
  p.loadPixels();

  return p.pixels;
};

/**
 * Replaces the whole pixels of the canvas.
 * Assigns the given pixels to `p.pixels` and calls `p.updatePixels()`.
 * @param pixels
 */
export const replaceCanvasPixels = (pixels: number[]): void => {
  p.pixels = pixels;
  p.updatePixels();
};
