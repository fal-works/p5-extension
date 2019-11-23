import { Random } from "../ccc";
import { p } from "../shared";

/**
 * Creates a 1-dimensional noise function with offset parameter.
 * @param offset Random if not specified.
 * @return New function that runs `noise()` of p5.
 */
export const withOffset = (offset = Random.value(4096)) => (x: number) =>
  p.noise(offset + x);

/**
 * Creates a 2-dimensional noise function with offset parameters.
 * @param offsetX Random if not specified.
 * @param offsetY Random if not specified.
 * @return New function that runs `noise()` of p5.
 */
export const withOffset2 = (
  offsetX = Random.value(4096),
  offsetY = Random.value(256)
) => (x: number, y: number) => p.noise(offsetX + x, offsetY + y);

/**
 * Creates a 3-dimensional noise function with offset parameters.
 * @param offsetX Random if not specified.
 * @param offsetY Random if not specified.
 * @param offsetZ Random if not specified.
 * @return New function that runs `noise()` of p5.
 */
export const withOffset3 = (
  offsetX = Random.value(4096),
  offsetY = Random.value(256),
  offsetZ = Random.value(16)
) => (x: number, y: number, z: number) =>
  p.noise(offsetX + x, offsetY + y, offsetZ + z);
