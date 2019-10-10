import p5 from "p5";
import { p } from "../../shared";
import { colorWithAlpha } from "./basic";

export interface Unit {
  readonly colors: readonly p5.Color[];
  readonly maxIndex: number;
}

/**
 * Creats an `AlphaColor` unit.
 * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
 * @param color
 * @param resolution
 */
export const create = (color: p5.Color | string, resolution: number): Unit => {
  const colors: p5.Color[] = new Array(resolution);
  const maxIndex = resolution - 1;

  if (resolution === 1) {
    colors[0] =
      typeof color === "string" ? p.color(color) : Object.assign({}, color);
  } else {
    for (let i = 0; i < resolution; i += 1) {
      colors[i] = colorWithAlpha(color, 255 * (i / maxIndex));
    }
  }

  return {
    colors,
    maxIndex
  };
};

/**
 * Gets a `p5.Color` instance.
 * @param alphaColor
 * @param alpha Alpha value from `0` to `1`.
 * @return A `p5.Color` instance.
 */
export const get = (alphaColor: Unit, alpha: number): p5.Color =>
  alphaColor.colors[Math.round(alphaColor.maxIndex * alpha)];
