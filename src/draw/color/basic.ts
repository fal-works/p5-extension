import p5 from "p5";
import { HSV, returnVoid } from "../../ccc";
import { p } from "../../shared";

/**
 * Creates a new `p5.Color` instance from another `p5.Color` or a color code string.
 * @param color
 */
export const parseColor = (color: p5.Color | string): p5.Color =>
  typeof color === "string" ? p.color(color) : Object.create(color);

/**
 * Creates a function that applies a stroke color.
 * @param color `null` will be `noStroke()` and `undefined` will have no effects.
 * @returns A function that runs either `stroke()`, `noStroke()` or nothing.
 */
export const parseStroke = (
  color: p5.Color | string | null | undefined
): (() => void) => {
  if (color === null) return p.noStroke.bind(p);
  if (color === undefined) return returnVoid;

  const colorObject = parseColor(color);
  return p.stroke.bind(p, colorObject);
};

/**
 * Creates a function that applies a fill color.
 * @param color `null` will be `noFill()` and `undefined` will have no effects.
 * @returns A function that runs either `fill()`, `noFill()` or nothing.
 */
export const parseFill = (
  color: p5.Color | string | null | undefined
): (() => void) => {
  if (color === null) return p.noFill.bind(p);
  if (color === undefined) return returnVoid;

  const colorObject = parseColor(color);
  return p.fill.bind(p, colorObject);
};

/**
 * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
 * The color mode should be `RGB` when using this function.
 * @param color
 * @param alpha
 */
export const colorWithAlpha = (color: p5.Color | string, alpha: number) => {
  const colorObject = typeof color === "string" ? p.color(color) : color;

  return p.color(
    p.red(colorObject),
    p.green(colorObject),
    p.blue(colorObject),
    alpha
  );
};

/**
 * Creates a new color by reversing each RGB value of the given `color`.
 * The alpha value will remain the same.
 * Be sure that the color mode is set to RGB ∈ [0, 255].
 * @param color
 * @returns New `p5.Color` instance with reversed RGB values.
 */
export const reverseColor = (color: p5.Color) =>
  p.color(
    255 - p.red(color),
    255 - p.green(color),
    255 - p.blue(color),
    p.alpha(color)
  );

/**
 * Creates a new color from HSV values.
 * Be sure that the color mode is set to RGB (red, green, blue, alpha ∈ [0, 255]).
 * @param hue [0, 360]
 * @param saturation [0, 1]
 * @param value [0, 1]
 * @param alpha [0, 255]
 * @returns New `p5.Color` instance.
 */
export const hsvColor = (
  hue: number,
  saturation: number,
  value: number,
  alpha = 255
) => {
  const [r, g, b] = HSV.toRGB([hue, saturation, value]);
  return p.color(r * 255, g * 255, b * 255, alpha);
};

/**
 * Converts a `p5.Color` instance to an object representation.
 * @param color
 * @returns RGB values.
 */
export const colorToRGB = (color: p5.Color) => {
  return {
    r: p.red(color),
    g: p.green(color),
    b: p.blue(color)
  };
};

/**
 * Converts a `p5.Color` instance to an object representation.
 * @param color
 * @returns ARGB values.
 */
export const colorToARGB = (color: p5.Color) => {
  return {
    a: p.alpha(color),
    r: p.red(color),
    g: p.green(color),
    b: p.blue(color)
  };
};
