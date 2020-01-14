import { returnVoid } from "../../ccc";
import { renderer } from "../../shared";
import { ColorParameter, parseStroke, parseFill } from "./basic";
import * as AlphaColor from "./alpha-color";

export interface Unit {
  readonly stroke: (alpha: number) => void;
  readonly fill: (alpha: number) => void;
}

/**
 * Creates a `ShapeColor` unit.
 * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
 * @param strokeColor `null` will be `noStroke()` and `undefined` will have no effects.
 * @param fillColor `null` will be `noFill()` and `undefined` will have no effects.
 * @param alphaResolution
 */
export const create = (
  strokeColor: ColorParameter | null | undefined,
  fillColor: ColorParameter | null | undefined,
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
    stroke = () => renderer.noStroke();
  } else if (strokeColor === undefined) {
    stroke = returnVoid;
  } else {
    const strokeAlphaColor = AlphaColor.create(strokeColor, alphaResolution);
    stroke = alpha => renderer.stroke(AlphaColor.get(strokeAlphaColor, alpha));
  }

  let fill: (alpha: number) => void;
  if (fillColor === null) {
    fill = () => renderer.noFill();
  } else if (fillColor === undefined) {
    fill = returnVoid;
  } else {
    const fillAlphaColor = AlphaColor.create(fillColor, alphaResolution);
    fill = alpha => renderer.fill(AlphaColor.get(fillAlphaColor, alpha));
  }

  return { stroke, fill };
};

/**
 * Applies the stroke and fill colors.
 * @param shapeColor
 * @param alpha Alpha value from `0` to `255`.
 */
export const apply = (shapeColor: Unit, alpha: number): void => {
  if (alpha < 1) {
    renderer.noStroke();
    renderer.noFill();
    return;
  }

  shapeColor.stroke(alpha);
  shapeColor.fill(alpha);
};
