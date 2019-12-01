import p5 from "p5";
import { p } from "../shared";
import { SetPixelFunction, SetPixelRowFunction } from "./internal-types";
import { createSetPixel, createSetPixelRow } from "./pixels";

/**
 * Draws texture on `renderer` by applying `runSetPixel` to each coordinate.
 * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
 * @param renderer - Instance of either p5 or p5.Graphics. Defaults to the shared `p`.
 */
export const drawTexture = (
  runSetPixel: (setPixel: SetPixelFunction, x: number, y: number) => void,
  renderer: p5 | p5.Graphics = p
): void => {
  const { width, height } = renderer;

  renderer.loadPixels();
  const setPixel = createSetPixel(renderer);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      runSetPixel(setPixel, x, y);
    }
  }

  renderer.updatePixels();
};

/**
 * Creates a texture by applying `runSetPixel` to each coordinate of a new `p5.Graphics` instance.
 * @param widht
 * @param height
 * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
 * @returns New `p5.Graphics` instance.
 */
export const createTexture = (
  width: number,
  height: number,
  runSetPixel: (setPixel: SetPixelFunction, x: number, y: number) => void
): p5.Graphics => {
  const graphics = p.createGraphics(width, height);
  drawTexture(runSetPixel, graphics);

  return graphics;
};

/**
 * Draws texture on `renderer` by applying `runSetPixelRow` to each y coordinate.
 * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
 * @param renderer - Instance of either p5 or p5.Graphics. Defaults to the shared `p`.
 */
export const drawTextureRowByRow = (
  runSetPixelRow: (setPixelRow: SetPixelRowFunction, y: number) => void,
  renderer: p5 | p5.Graphics = p
): void => {
  const { height } = renderer;

  renderer.loadPixels();
  const setPixelRow = createSetPixelRow(renderer);

  for (let y = 0; y < height; y += 1) runSetPixelRow(setPixelRow, y);

  renderer.updatePixels();
};

/**
 * Creates a texture by applying `runSetPixelRow` to each y coordinate of a new `p5.Graphics` instance.
 * @param width
 * @param height
 * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
 * @returns New `p5.Graphics` instance.
 */
export const createTextureRowByRow = (
  width: number,
  height: number,
  runSetPixelRow: (setPixelRow: SetPixelRowFunction, y: number) => void
): p5.Graphics => {
  const graphics = p.createGraphics(width, height);
  drawTextureRowByRow(runSetPixelRow, graphics);

  return graphics;
};
