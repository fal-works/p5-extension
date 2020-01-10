import p5 from "p5";
import { p } from "../shared";
import { SetPixelFunction, SetPixelRowFunction } from "./internal-types";

/**
 * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
 * The style and transformations will be restored by using `p.push()` and `p.pop()`.
 *
 * @deprecated Maybe `storePixels()` is better.
 * @param p The p5 instance.
 * @param drawCallback
 * @returns Pixels of the canvas after applying `drawCallback`.
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
 *
 * @deprecated Maybe `storePixels()` is better.
 * @param pixels
 */
export const replaceCanvasPixels = (pixels: number[]): void => {
  p.pixels = pixels;
  p.updatePixels();
};

/**
 * Stores the current canvas pixels and returns a function that restores them.
 * @param renderer - Instance of either p5 or p5.Graphics. Defaults to shared `p`.
 * @param prepareCallback - Function that will be run just before `loadPixels()`.
 * @returns A function that restores the canvas pixels.
 */
export const storePixels = (
  renderer: p5 | p5.Graphics = p,
  prepareCallback?: (renderer: p5 | p5.Graphics) => void | p5
) => {
  if (prepareCallback) {
    renderer.push();
    prepareCallback(renderer);
    renderer.pop();
  }
  renderer.loadPixels();
  const storedPixels = renderer.pixels;

  return () => {
    renderer.pixels = storedPixels;
    renderer.updatePixels();
  };
};

/**
 * Creates a function for setting color to the specified point.
 * Should be used in conjunction with loadPixels() and updatePixels().
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param logicalX - The logical x index of the point.
 * @param logicalY - The logical y index of the point.
 * @param red - The red value (0 - 255).
 * @param green - The green value (0 - 255).
 * @param blue - The blue value (0 - 255).
 */
export const createSetPixel = (
  renderer: p5 | p5.Graphics = p
): SetPixelFunction => {
  const density = renderer.pixelDensity();
  const pixelWidth = renderer.width * density;
  const { pixels } = renderer;

  return (logicalX, logicalY, red, green, blue, alpha) => {
    // physical X
    const startX = logicalX * density;
    const endX = startX + density;

    // physical Y
    const startY = logicalY * density;
    const endY = startY + density;

    for (let y = startY; y < endY; y += 1) {
      const pixelIndexAtX0 = y * pixelWidth;

      for (let x = startX; x < endX; x += 1) {
        const valueIndex = 4 * (pixelIndexAtX0 + x);
        pixels[valueIndex] = red;
        pixels[valueIndex + 1] = green;
        pixels[valueIndex + 2] = blue;
        pixels[valueIndex + 3] = alpha;
      }
    }
  };
};

/**
 * Creates a function for setting color to the specified row of pixels.
 * Should be used in conjunction with loadPixels() and updatePixels().
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param logicalY - The logical y index of the pixel row.
 * @param red - The red value (0 - 255).
 * @param green - The green value (0 - 255).
 * @param blue - The blue value (0 - 255).
 * @param alpha - The alpha value (0 - 255).
 */
export const createSetPixelRow = (
  renderer: p5 | p5.Graphics = p
): SetPixelRowFunction => {
  const density = renderer.pixelDensity();
  const pixelWidth = renderer.width * density;
  const { pixels } = renderer;

  return (logicalY, red, green, blue, alpha) => {
    // physical Y
    const startY = logicalY * density;
    const endY = startY + density;

    for (let y = startY; y < endY; y += 1) {
      const pixelIndexAtX0 = y * pixelWidth;

      for (let x = 0; x < pixelWidth; x += 1) {
        const valueIndex = 4 * (pixelIndexAtX0 + x);
        pixels[valueIndex] = red;
        pixels[valueIndex + 1] = green;
        pixels[valueIndex + 2] = blue;
        pixels[valueIndex + 3] = alpha;
      }
    }
  };
};
