import p5 from "p5";
import {
  RectangleSize,
  RectangleRegion,
  FitBox,
  HtmlUtility,
  Vector2D
} from "@fal-works/creative-coding-core";

import { p } from "./shared";
import { drawScaled } from "./draw/transform";

/**
 * p5.js canvas accompanied by a scale factor.
 */
export interface ScaledCanvas {
  readonly p5Canvas: p5.Renderer;

  /**
   * The ratio of the physical size to the logical size, i.e. `scaleFactor * (logical size) = (physical size)`
   */
  readonly scaleFactor: number;

  readonly logicalSize: RectangleSize.Unit;
  readonly logicalRegion: RectangleRegion.Unit;
  readonly drawScaled: (drawCallback: () => void) => void;
  readonly logicalCenterPosition: Vector2D.Unit;
}

/**
 * Runs `p.createCanvas()` with the scaled size that fits to `node`.
 * Returns a `ScaledCanvas` instance, which includes the created canvas and the scale factor.
 *
 * @param node The HTML element or its ID.
 * @param logicalSize
 * @param fittingOption
 * @param renderer
 * @return A `ScaledCanvas` instance.
 */
export const createScaledCanvas = (
  node: HTMLElement | string,
  logicalSize: RectangleSize.Unit,
  fittingOption?: FitBox.FittingOption,
  renderer?: "p2d" | "webgl" | undefined
): ScaledCanvas => {
  const maxCanvasSize = HtmlUtility.getElementSize(
    typeof node === "string" ? HtmlUtility.getElementOrBody(node) : node
  );
  const scaleFactor = FitBox.calculateScaleFactor(
    logicalSize,
    maxCanvasSize,
    fittingOption
  );

  const canvas = p.createCanvas(
    scaleFactor * logicalSize.width,
    scaleFactor * logicalSize.height,
    renderer
  );

  return {
    p5Canvas: canvas,
    scaleFactor: scaleFactor,
    logicalSize,
    logicalRegion: RectangleRegion.create(Vector2D.zero, logicalSize),
    drawScaled: (drawCallback: () => void): void =>
      drawScaled(drawCallback, scaleFactor),
    logicalCenterPosition: {
      x: logicalSize.width / 2,
      y: logicalSize.height / 2
    }
  };
};
