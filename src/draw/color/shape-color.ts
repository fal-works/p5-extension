import p5 from "p5";
import { p } from "../../shared";
import { parseStroke, parseFill } from "./basic";
import * as AlphaColor from "./alpha-color";

export interface Unit {
  readonly stroke: (alhpa: number) => void;
  readonly fill: (alpha: number) => void;
}

const emptyFunction = () => {};

/**
 * Creats a `ShapeColor` unit.
 * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
 * @param strokeColor `null` will be `noStroke()` and `undefined` will have no effects.
 * @param fillColor `null` will be `noFill()` and `undefined` will have no effects.
 * @param alphaResolution
 */
export const create = (
  strokeColor: p5.Color | string | null | undefined,
  fillColor: p5.Color | string | null | undefined,
  alphaResolution: number
): Unit => {
  if (alphaResolution === 1) {
    return {
      stroke: parseStroke(strokeColor),
      fill: parseFill(fillColor)
    };
  }

  let stroke: (alpha: number) => void;
  if (strokeColor === null) {
    stroke = () => p.noStroke();
  } else if (strokeColor === undefined) {
    stroke = emptyFunction;
  } else {
    const strokeAlphaColor = AlphaColor.create(strokeColor, alphaResolution);
    stroke = alpha => p.stroke(AlphaColor.get(strokeAlphaColor, alpha));
  }

  let fill: (alpha: number) => void;
  if (fillColor === null) {
    fill = () => p.noFill();
  } else if (fillColor === undefined) {
    fill = emptyFunction;
  } else {
    const fillAlphaColor = AlphaColor.create(fillColor, alphaResolution);
    fill = alpha => p.fill(AlphaColor.get(fillAlphaColor, alpha));
  }

  return { stroke, fill };
};

/**
 * Applies the stroke and fill colors.
 * @param shapeColor
 * @param alpha Alpha value from `0` to `1`.
 */
export const apply = (shapeColor: Unit, alpha: number): void => {
  shapeColor.stroke(alpha);
  shapeColor.fill(alpha);
};
