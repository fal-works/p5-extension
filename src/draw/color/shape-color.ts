import { returnVoid } from "../../ccc";
import { p, renderer } from "../../shared";
import { onSetup } from "../../setup";
import { ColorParameter, parseStroke, parseFill } from "./basic";
import * as AlphaColor from "./alpha-color";

export interface Unit {
  stroke: (alpha: number) => void;
  fill: (alpha: number) => void;
}

const overwrite = (
  shapeColor: Unit,
  strokeColor: ColorParameter | null | undefined,
  fillColor: ColorParameter | null | undefined,
  alphaResolution: number
): Unit => {
  if (alphaResolution === 1) {
    shapeColor.stroke = parseStroke(strokeColor);
    shapeColor.fill = parseFill(fillColor);

    return shapeColor;
  }

  if (strokeColor === null) {
    shapeColor.stroke = () => renderer.noStroke();
  } else if (strokeColor === undefined) {
    shapeColor.stroke = returnVoid;
  } else {
    const strokeAlphaColor = AlphaColor.create(strokeColor, alphaResolution);
    shapeColor.stroke = (alpha) =>
      renderer.stroke(AlphaColor.get(strokeAlphaColor, alpha));
  }

  if (fillColor === null) {
    shapeColor.fill = () => renderer.noFill();
  } else if (fillColor === undefined) {
    shapeColor.fill = returnVoid;
  } else {
    const fillAlphaColor = AlphaColor.create(fillColor, alphaResolution);
    shapeColor.fill = (alpha) =>
      renderer.fill(AlphaColor.get(fillAlphaColor, alpha));
  }

  return shapeColor;
};

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
  const shapeColor: Unit = {
    stroke: returnVoid,
    fill: returnVoid,
  };
  const prepareShapeColor = overwrite.bind(
    undefined,
    shapeColor,
    strokeColor,
    fillColor,
    alphaResolution
  );

  if (p) return prepareShapeColor();

  onSetup.push(prepareShapeColor);

  return shapeColor;
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
