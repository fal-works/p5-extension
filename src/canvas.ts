import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";

import { RectangleRegion, FitBox, Vector2D } from "./ccc";
import { p } from "./shared";
import { drawScaled } from "./draw/transform";
import { getWindowSize } from "./misc/window";

export interface Canvas {
  readonly p5Canvas: p5.Renderer;
  readonly logicalSize: CCC.RectangleSize.Unit;
  readonly logicalRegion: CCC.RectangleRegion.Unit;
  readonly logicalCenterPosition: CCC.Vector2D.Unit;
}

/**
 * p5.js canvas accompanied by a scale factor.
 */
export interface ScaledCanvas extends Canvas {
  /**
   * The ratio of the physical size to the logical size, i.e. `scaleFactor * (logical size) = (physical size)`
   */
  scaleFactor: number;

  /**
   * A function that runs `drawCallback` scaled with `scaleFactor`.
   */
  readonly drawScaled: (drawCallback: () => void) => void;
}

const constructCanvas = (
  logicalSize: CCC.RectangleSize.Unit,
  scaleFactor: number,
  renderer?: "p2d" | "webgl"
) => {
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
    logicalSize,
    logicalRegion: RectangleRegion.create(Vector2D.zero, logicalSize),
    logicalCenterPosition: {
      x: logicalSize.width / 2,
      y: logicalSize.height / 2
    },
    scaleFactor,
    drawScaled: drawScaledFunction
  };
};

/**
 * Creates a `ScaledCanvas` instance with the scaled size that fits to `physicalContainerSize`.
 *
 * @param parameters.logicalSize
 * @param parameters.physicalContainerSize Defaults to the window size.
 * @param parameters.fittingOption No scaling if `null`.
 * @param parameters.renderer
 * @returns A `ScaledCanvas` instance.
 */
export const createScaledCanvas = (parameters: {
  logicalSize: CCC.RectangleSize.Unit;
  physicalContainerSize?: CCC.RectangleSize.Unit;
  fittingOption?: CCC.FitBox.FittingOption | null;
  renderer?: "p2d" | "webgl";
}): ScaledCanvas => {
  const {
    logicalSize,
    physicalContainerSize,
    fittingOption,
    renderer
  } = Object.assign(
    {
      physicalContainerSize: getWindowSize()
    },
    parameters
  );

  const scaleFactor =
    fittingOption !== null
      ? FitBox.calculateScaleFactor(
          logicalSize,
          physicalContainerSize,
          fittingOption
        )
      : 1;

  return constructCanvas(logicalSize, scaleFactor, renderer);
};

/**
 * Creates a `ScaledCanvas` instance with the scaled height that fits to `physicalContainerSize`.
 * The width will be determined according to the aspect ratio of `physicalContainerSize`.
 *
 * @param parameters.logicalHeight
 * @param parameters.physicalContainerSize Defaults to the window size.
 * @param parameters.renderer
 * @param parameters.disableScaling
 * @returns A `ScaledCanvas` instance.
 */
export const createFullScaledCanvas = (parameters: {
  logicalHeight: number;
  physicalContainerSize?: CCC.RectangleSize.Unit;
  renderer?: "p2d" | "webgl";
  disableScaling?: boolean;
}): ScaledCanvas => {
  const { logicalHeight, physicalContainerSize, renderer } = Object.assign(
    {
      physicalContainerSize: getWindowSize()
    },
    parameters
  );

  const scaleFactor = !parameters.disableScaling
    ? physicalContainerSize.height / logicalHeight
    : 1;

  const logicalSize: CCC.RectangleSize.Unit = {
    width: physicalContainerSize.width / scaleFactor,
    height: logicalHeight
  };

  return constructCanvas(logicalSize, scaleFactor, renderer);
};
