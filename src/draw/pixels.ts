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
export const createSetPixel = (renderer: p5 | p5.Graphics) => {
  const density = renderer.pixelDensity();
  const pixelWidth = renderer.width * density;
  const { pixels } = renderer;

  return (
    logicalX: number,
    logicalY: number,
    red: number,
    green: number,
    blue: number,
    alpha: number
  ) => {
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
export const createSetPixelRow = (renderer: p5 | p5.Graphics) => {
  const density = renderer.pixelDensity();
  const pixelWidth = renderer.width * density;
  const { pixels } = renderer;

  return (
    logicalY: number,
    red: number,
    green: number,
    blue: number,
    alpha: number
  ) => {
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
