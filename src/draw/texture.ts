import p5 from "p5";
import { p } from "../shared";
import {
  createSetPixel,
  createSetPixelRow,
  SetPixelFunction,
  SetPixelRowFunction
} from "./pixels";

/**
 * Draws texture on `renderer` by applying `runSetPixel` to each coordinate.
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
 */
export const drawTexture = (
  renderer: p5 | p5.Graphics,
  runSetPixel: (setPixel: SetPixelFunction, x: number, y: number) => void
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
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
 * @returns New `p5.Graphics` instance.
 */
export const createTexture = (
  width: number,
  height: number,
  runSetPixel: (setPixel: SetPixelFunction, x: number, y: number) => void
): p5.Graphics => {
  const graphics = p.createGraphics(width, height);
  drawTexture(graphics, runSetPixel);

  return graphics;
};

/**
 * Draws texture on `renderer` by applying `runSetPixelRow` to each y coordinate.
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
 */
export const drawTextureRowByRow = (
  renderer: p5 | p5.Graphics,
  runSetPixelRow: (setPixelRow: SetPixelRowFunction, y: number) => void
): void => {
  const { height } = renderer;

  renderer.loadPixels();
  const setPixelRow = createSetPixelRow(renderer);

  for (let y = 0; y < height; y += 1) runSetPixelRow(setPixelRow, y);

  renderer.updatePixels();
};

/**
 * Creates a texture by applying `runSetPixelRow` to each y coordinate of a new `p5.Graphics` instance..
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
 * @returns New `p5.Graphics` instance.
 */
export const createTextureRowByRow = (
  width: number,
  height: number,
  runSetPixelRow: (setPixelRow: SetPixelRowFunction, y: number) => void
): p5.Graphics => {
  const graphics = p.createGraphics(width, height);
  drawTextureRowByRow(graphics, runSetPixelRow);

  return graphics;
};
