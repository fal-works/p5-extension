import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";

import { RectangleRegion, FitBox, Vector2D, returnVoid } from "./ccc";
import { p } from "./shared";
import { drawScaled } from "./draw/transform";
import { getWindowSize } from "./misc/window";
import { SketchSettings } from "./sketch";

export interface Canvas {
  readonly p5Canvas: p5.Renderer;
  logicalSize: CCC.RectangleSize.Unit;
  logicalRegion: CCC.RectangleRegion.Unit;
  logicalCenterPosition: CCC.Vector2D.Unit;
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
   * @param drawCallback
   */
  drawScaled: (drawCallback: () => void) => void;

  /**
   * Resizes the canvas according to the current container size and updates
   * related data if the required scale factor has been changed.
   * @param noRedraw
   * @returns `true` if resized.
   */
  readonly resizeIfNeeded: (noRedraw?: boolean) => boolean;
}

interface ScalingData {
  scaleFactor: number;
  logicalSize: CCC.RectangleSize.Unit;
}

/** @returns `true` if `a` equals `b`. */
const compareScalingData = (a: ScalingData, b: ScalingData) => {
  if (a.scaleFactor !== b.scaleFactor) return false;

  const sizeA = a.logicalSize;
  const sizeB = b.logicalSize;

  return sizeA.width === sizeB.width && sizeB.height === sizeB.height;
};

/** Used in `constructCanvas()`. */
const getPhysicalCanvasSize = (data: ScalingData) => {
  const { scaleFactor, logicalSize } = data;

  return {
    width: scaleFactor * logicalSize.width,
    height: scaleFactor * logicalSize.height
  };
};

/** Used in `constructCanvas()`. */
const getScaledCanvasAttributes = (data: ScalingData) => {
  const { scaleFactor, logicalSize } = data;

  const drawScaledFunction: (drawCallback: () => void) => void =
    scaleFactor !== 1
      ? drawCallback => drawScaled(drawCallback, scaleFactor)
      : drawCallback => drawCallback();

  return {
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

/** Used in `createScaledCanvas()` and `createFullScaledCanvas()`. */
const constructCanvas = (
  getScalingData: () => ScalingData,
  onResizeCanvas: (p: p5) => void = returnVoid,
  renderer?: "p2d" | "webgl"
): ScaledCanvas => {
  const scalingData = getScalingData();
  const { width, height } = getPhysicalCanvasSize(scalingData);
  const p5Canvas = p.createCanvas(width, height, renderer);

  const canvas = Object.assign(
    { p5Canvas },
    getScaledCanvasAttributes(scalingData)
  );

  let previousScalingData = scalingData;

  const resizeIfNeeded: ScaledCanvas["resizeIfNeeded"] = noRedraw => {
    const scalingData = getScalingData();
    if (compareScalingData(previousScalingData, scalingData)) return false;

    const { width, height } = getPhysicalCanvasSize(scalingData);
    p.resizeCanvas(width, height, noRedraw);

    const data = getScaledCanvasAttributes(scalingData);
    Object.assign(canvas, data);

    previousScalingData = scalingData;

    onResizeCanvas(p);

    return true;
  };

  return Object.assign(canvas, { resizeIfNeeded });
};

/**
 * Creates a `ScaledCanvas` instance with the scaled size that fits to the physical container size.
 *
 * @param parameters.logicalSize
 * @param parameters.getPhysicalContainerSize Defaults to a function that gets the window size.
 * @param parameters.fittingOption No scaling if `null`.
 * @param parameters.renderer
 * @returns A `ScaledCanvas` instance.
 */
export const createScaledCanvas = (parameters: {
  logicalSize: CCC.RectangleSize.Unit;
  getPhysicalContainerSize?: () => CCC.RectangleSize.Unit;
  fittingOption?: CCC.FitBox.FittingOption | null;
  onResizeCanvas: SketchSettings["onResizeCanvas"];
  renderer?: "p2d" | "webgl";
}): ScaledCanvas => {
  const {
    logicalSize,
    getPhysicalContainerSize,
    fittingOption,
    onResizeCanvas,
    renderer
  } = Object.assign(
    {
      getPhysicalContainerSize: getWindowSize
    },
    parameters
  );

  const getScaleFactor =
    fittingOption !== null
      ? () =>
          FitBox.calculateScaleFactor(
            logicalSize,
            getPhysicalContainerSize(),
            fittingOption
          )
      : CCC.ConstantFunction.returnOne;

  const getScalingData = (): ScalingData => ({
    scaleFactor: getScaleFactor(),
    logicalSize
  });

  return constructCanvas(getScalingData, onResizeCanvas, renderer);
};

/**
 * Creates a `ScaledCanvas` instance with the scaled height that fits to the physical container size.
 * The width will be determined according to the aspect ratio of the container size.
 *
 * @param parameters.logicalHeight
 * @param parameters.getPhysicalContainerSize Defaults to a function that gets the window size.
 * @param parameters.renderer
 * @param parameters.disableScaling
 * @returns A `ScaledCanvas` instance.
 */
export const createFullScaledCanvas = (parameters: {
  logicalHeight: number;
  getPhysicalContainerSize?: () => CCC.RectangleSize.Unit;
  onResizeCanvas: SketchSettings["onResizeCanvas"];
  renderer?: "p2d" | "webgl";
  disableScaling?: boolean;
}): ScaledCanvas => {
  const {
    logicalHeight,
    getPhysicalContainerSize,
    onResizeCanvas,
    renderer
  } = Object.assign({ getPhysicalContainerSize: getWindowSize }, parameters);

  const getScaleFactor = !parameters.disableScaling
    ? () => getPhysicalContainerSize().height / logicalHeight
    : CCC.ConstantFunction.returnOne;

  const getScalingData = (): ScalingData => {
    const scaleFactor = getScaleFactor();

    return {
      scaleFactor,
      logicalSize: {
        width: getPhysicalContainerSize().width / scaleFactor,
        height: logicalHeight
      }
    };
  };

  return constructCanvas(getScalingData, onResizeCanvas, renderer);
};
