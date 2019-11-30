import { randomValue } from "../ccc";
import { p } from "../shared";

/**
 * Creates a 1-dimensional noise function with offset parameter.
 * @param offset Random if not specified.
 * @return New function that runs `noise()` of p5.
 */
export const withOffset = (offset = randomValue(4096)) => (x: number) =>
  p.noise(offset + x);

/**
 * Creates a 2-dimensional noise function with offset parameters.
 * @param offsetX Random if not specified.
 * @param offsetY Random if not specified.
 * @return New function that runs `noise()` of p5.
 */
export const withOffset2 = (
  offsetX = randomValue(4096),
  offsetY = randomValue(256)
) => (x: number, y: number) => p.noise(offsetX + x, offsetY + y);

/**
 * Creates a 3-dimensional noise function with offset parameters.
 * @param offsetX Random if not specified.
 * @param offsetY Random if not specified.
 * @param offsetZ Random if not specified.
 * @return New function that runs `noise()` of p5.
 */
export const withOffset3 = (
  offsetX = randomValue(4096),
  offsetY = randomValue(256),
  offsetZ = randomValue(16)
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
  offset = randomValue(4096)
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
  offsetX = randomValue(4096),
  offsetY = randomValue(256)
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
  offsetX = randomValue(4096),
  offsetY = randomValue(256),
  offsetZ = randomValue(16)
) => {
  let z = offsetZ;

  return (x: number, y: number) =>
    p.noise(offsetX + x, offsetY + y, (z += changeRate));
};

/**
 * The expected average value of the result of p5 `noise()`.
 * (May not be accurate)
 */
export const AVERAGE = ((repetition: number) => {
  let accumulation = 0;
  let n = 1;
  for (let i = 0; i < repetition; i += 1) accumulation += n /= 2;
  return accumulation / 2;
})(10);
