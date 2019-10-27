import p5 from "p5";
import { p } from "../../shared";

/**
 * Creates a new `p5.Color` instance from another `p5.Color` or a color code string.
 * @param color
 */
export const parseColor = (color: p5.Color | string): p5.Color =>
  typeof color === "string" ? p.color(color) : Object.assign({}, color);

const emptyFunction = () => {};

/**
 * Creates a function that applies a stroke color.
 * @param color `null` will be `noStroke()` and `undefined` will have no effects.
 * @return A function that runs either `stroke()`, `noStroke()` or nothing.
 */
export const parseStroke = (
  color: p5.Color | string | null | undefined
): (() => void) => {
  if (color === null) return p.noStroke.bind(p);
  if (color === undefined) return emptyFunction;

  const colorObject = parseColor(color);
  return p.stroke.bind(p, colorObject);
};

/**
 * Creates a function that applies a fill color.
 * @param color `null` will be `noFill()` and `undefined` will have no effects.
 * @return A function that runs either `fill()`, `noFill()` or nothing.
 */
export const parseFill = (
  color: p5.Color | string | null | undefined
): (() => void) => {
  if (color === null) return p.noFill.bind(p);
  if (color === undefined) return emptyFunction;

  const colorObject = parseColor(color);
  return p.fill.bind(p, colorObject);
};

/**
 * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
 * @param color
 * @param alpha
 */
export const colorWithAlpha = (color: p5.Color | string, alpha: number) => {
  const colorObject = parseColor(color);
  colorObject.setAlpha(alpha);

  return colorObject;
};

/**
 * Creates a new color by reversing each RGB value of the given `color`.
 * The alpha value will remain the same.
 * Be sure that the color mode is set to RGB ∈ [0, 255].
 * @param color
 * @return New `p5.Color` instance with reversed RGB values.
 */
export const reverseColor = (color: p5.Color) =>
  p.color(
    255 - p.red(color),
    255 - p.green(color),
    255 - p.blue(color),
    p.alpha(color)
  );
