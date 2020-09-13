import p5 from "p5";
import { Cielab } from "../../ccc";
import { p } from "../../shared";

/**
 * Creates a new color from CIELAB values.
 * Be sure that the color mode is set to RGB (red, green, blue, alpha ∈ [0, 255]).
 * @param lValue - L*: Lightness in rage [0, 100]
 * @param aValue - a* in range [0, ca. 100]
 * @param bValue - b* in range [0, ca. 100]
 * @param alpha Alpha in range [0, 255]
 * @returns New `p5.Color` instance.
 */
export const cielabColor = (
  l: number,
  a: number,
  b: number,
  alpha?: number
): p5.Color => {
  const [red, green, blue] = Cielab.cielabColor(l, a, b);
  return p.color(red, green, blue, alpha);
};

/**
 * Creates a new color from CIELCh values.
 * Be sure that the color mode is set to RGB (red, green, blue, alpha ∈ [0, 255]).
 * @param lValue - L*: Lightness in range [0, 100]
 * @param cValue - C*: Chroma in range [0, ca. 100]
 * @param hValue - h*: Hue in range [0, 2π)
 * @param alpha Alpha in range [0, 255]
 * @returns New `p5.Color` instance.
 */
export const cielchColor = (
  l: number,
  c: number,
  h: number,
  alpha?: number
): p5.Color => {
  const [red, green, blue] = Cielab.cielchColor(l, c, h);
  return p.color(red, green, blue, alpha);
};
