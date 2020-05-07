import p5 from "p5";
import { round, INVERSE255 } from "../../ccc";
import { p } from "../../shared";
import { ColorParameter, parseColor, colorWithAlpha } from "./basic";

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
export const create = (color: ColorParameter, resolution: number): Unit => {
  const colors: p5.Color[] = new Array(resolution);
  const maxIndex = resolution - 1;
  const baseColor = parseColor(color);

  if (resolution === 1) {
    colors[0] = baseColor;
  } else {
    const baseAlpha = p.alpha(baseColor);
    for (let i = 1; i < resolution; i += 1) {
      const alpha = baseAlpha * (i / maxIndex);
      colors[i] = colorWithAlpha(baseColor, alpha);
    }
  }

  return {
    colors,
    maxIndex,
  };
};

/**
 * Gets a `p5.Color` instance.
 * @param alphaColor
 * @param alpha Alpha value from `0` to `255`.
 * @returns A `p5.Color` instance.
 */
export const get = (alphaColor: Unit, alpha: number): p5.Color =>
  alphaColor.colors[round(alphaColor.maxIndex * alpha * INVERSE255)];
