import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";

import { RectangleRegion, FitBox, HtmlUtility, Vector2D } from "./ccc";
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

  readonly logicalSize: CCC.RectangleSize.Unit;
  readonly logicalRegion: CCC.RectangleRegion.Unit;
  readonly drawScaled: (drawCallback: () => void) => void;
  readonly logicalCenterPosition: CCC.Vector2D.Unit;
}

/**
 * Runs `p.createCanvas()` with the scaled size that fits to `node`.
 * Returns a `ScaledCanvas` instance, which includes the created canvas and the scale factor.
 *
 * @param node The HTML element or its ID.
 * @param logicalSize
 * @param fittingOption No scaling if `null`.
 * @param renderer
 * @return A `ScaledCanvas` instance.
 */
export const createScaledCanvas = (
  node: HTMLElement | string,
  logicalSize: CCC.RectangleSize.Unit,
  fittingOption?: CCC.FitBox.FittingOption | null,
  renderer?: "p2d" | "webgl"
): ScaledCanvas => {
  const maxCanvasSize = HtmlUtility.getElementSize(
    typeof node === "string" ? HtmlUtility.getElementOrBody(node) : node
  );
  const scaleFactor =
    fittingOption !== null
      ? FitBox.calculateScaleFactor(logicalSize, maxCanvasSize, fittingOption)
      : 1;

  const p5Canvas = p.createCanvas(
    scaleFactor * logicalSize.width,
    scaleFactor * logicalSize.height,
    renderer
  );

  const drawScaledFunction: (drawCallback: () => void) => void =
    scaleFactor !== 1
      ? drawCallback => drawScaled(drawCallback, scaleFactor)
      : drawCallback => drawCallback();

  return {
    p5Canvas,
    scaleFactor,
    logicalSize,
    logicalRegion: RectangleRegion.create(Vector2D.zero, logicalSize),
    drawScaled: drawScaledFunction,
    logicalCenterPosition: {
      x: logicalSize.width / 2,
      y: logicalSize.height / 2
    }
  };
};
