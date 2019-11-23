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

/**
 * Creates a noise function without arguments that returns every time an updated value.
 * @param changeRate
 * @param offset Random if not specified.
 * @return New function that runs `noise()` of p5, internally changing the `x` argument by `changeRate`.
 */
export const withChangeRate = (
  changeRate: number,
  offset = Random.value(4096)
) => {
  let x = offset;

  return () => p.noise((x += changeRate));
};

/**
 * Creates a 1-dimensional noise function that returns every time an updated value.
 * @param changeRate
 * @param offsetX Random if not specified.
 * @param offsetY Random if not specified.
 * @return New function that runs `noise()` of p5, internally changing the `y` argument by `changeRate`.
 */
export const withChangeRate1 = (
  changeRate: number,
  offsetX = Random.value(4096),
  offsetY = Random.value(256)
) => {
  let y = offsetY;

  return (x: number) => p.noise(offsetX + x, (y += changeRate));
};

/**
 * Creates a 2-dimensional noise function that returns every time an updated value.
 * @param changeRate
 * @param offsetX Random if not specified.
 * @param offsetY Random if not specified.
 * @param offsetZ Random if not specified.
 * @return New function that runs `noise()` of p5, internally changing the `z` argument by `changeRate`.
 */
export const withChangeRate2 = (
  changeRate: number,
  offsetX = Random.value(4096),
  offsetY = Random.value(256),
  offsetZ = Random.value(16)
) => {
  let z = offsetZ;

  return (x: number, y: number) =>
    p.noise(offsetX + x, offsetY + y, (z += changeRate));
};
