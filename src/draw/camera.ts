import * as CCC from "@fal-works/creative-coding-core";
import {
  copyVector,
  zeroVector,
  constrainVector,
  RectangleRegion,
  FitBox,
  max2,
  Tween,
  Timer,
  clamp
} from "../ccc";
import { drawTranslatedAndScaled } from "./transform";

export interface Unit {
  /** The boundary in which `focusPoint` should be constrained according to the current value of `zoomFactor`. */
  readonly regionBoundary: CCC.RectangleRegion.Unit;

  /** The size of the rectangle in which the content will be displayed. */
  readonly displaySize: CCC.RectangleSize.Unit;

  /** The top-left point of the rectangle in which the content will be displayed. */
  readonly displayPosition: CCC.Vector2D.Mutable.Unit;

  /** The logical coordinates of the point on which the camera is focusing. */
  readonly focusPoint: CCC.Vector2D.Mutable.Unit;

  /**
   * The min/max values of `zoomFactor`.
   * `zoomFactorRange.start` is set to at least the value where the entire region fits to `displaySize`.
   */
  readonly zoomFactorRange: CCC.Range;

  /** Current zoom factor. */
  zoomFactor: number;

  /** Timer for zoom in/out that is currently running. */
  zoomTimer: CCC.Timer.Unit;

  /**
   * The end value of tweening zoom factor by `zoomTimer`.
   * `undefined` If tweening is not running.
   */
  targetZoomFactor: number | undefined;
}

export let debugMode = true;
export const setDebugMode = (flag = true) => (debugMode = flag);

export const create = (parameters: {
  displaySize: CCC.RectangleSize.Unit;
  regionBoundary?: CCC.RectangleRegion.Unit;
  initialDisplayPosition?: CCC.Vector2D.Unit;
  initialFocusPoint?: CCC.Vector2D.Unit;
  minZoomFactor?: number;
  maxZoomFactor?: number;
}): Unit => {
  const {
    displaySize,
    initialDisplayPosition,
    initialFocusPoint,
    minZoomFactor,
    maxZoomFactor
  } = parameters;

  const regionBoundary = parameters.regionBoundary || {
    topLeft: { x: -Infinity, y: -Infinity },
    rightBottom: { x: Infinity, y: Infinity }
  };

  const zoomFactorThreshold = FitBox.calculateScaleFactor(
    RectangleRegion.getSize(regionBoundary),
    displaySize
  );
  const zoomFactorRangeStart = minZoomFactor
    ? max2(zoomFactorThreshold, minZoomFactor)
    : zoomFactorThreshold;
  const zoomFactorRangeEnd = maxZoomFactor
    ? max2(zoomFactorRangeStart, maxZoomFactor)
    : Infinity;

  return {
    focusPoint: initialFocusPoint
      ? copyVector(initialFocusPoint)
      : regionBoundary
      ? RectangleRegion.getCenterPoint(regionBoundary)
      : copyVector(zeroVector),
    displaySize,
    displayPosition: copyVector(initialDisplayPosition || zeroVector),
    regionBoundary,
    zoomFactorRange: {
      start: zoomFactorRangeStart,
      end: zoomFactorRangeEnd
    },
    zoomFactor: 1,
    zoomTimer: Timer.dummy,
    targetZoomFactor: undefined
  };
};

export const update = (camera: Unit) => {
  const {
    displaySize: { width, height },
    regionBoundary: {
      topLeft: { x: leftX, y: topY },
      rightBottom: { x: rightX, y: bottomY }
    },
    zoomFactor
  } = camera;

  const logicalHalfWidth = width / (2 * zoomFactor);
  const logicalHalfHeight = height / (2 * zoomFactor);

  const minX = leftX + logicalHalfWidth;
  const maxX = rightX - logicalHalfWidth;
  const minY = topY + logicalHalfHeight;
  const maxY = bottomY - logicalHalfHeight;

  constrainVector(camera.focusPoint, minX, maxX, minY, maxY);

  Timer.Component.step(camera.zoomTimer);
};

export const draw = (camera: Unit, drawCallback: () => void) => {
  const { displaySize, displayPosition, focusPoint, zoomFactor } = camera;
  drawTranslatedAndScaled(
    drawCallback,
    displayPosition.x + displaySize.width / 2 - zoomFactor * focusPoint.x,
    displayPosition.y + displaySize.height / 2 - zoomFactor * focusPoint.y,
    zoomFactor
  );
};

/**
 * Stops and discards the timer for zoom in/out that is currently running.
 * @param camera
 */
export const stopTweenZoom = (camera: Unit) => {
  camera.zoomTimer = Timer.dummy;
  camera.targetZoomFactor = undefined;
};

/**
 * Sets the zoom factor of `camera` immediately to `zoomFactor`.
 * If any zoom timer is set by `tweenZoom`, it will be stopped and discarded.
 * @param camera
 * @param zoomFactor
 */
export const setZoom = (camera: Unit, zoomFactor: number) => {
  const { zoomFactorRange } = camera;
  const newZoomFactor = clamp(
    zoomFactor,
    zoomFactorRange.start,
    zoomFactorRange.end
  );
  camera.zoomFactor = newZoomFactor;

  stopTweenZoom(camera);
};

/**
 * Creates and sets a `Timer` component for changing the zoom factor.
 * The timer will be automatically run in `Camera.update`.
 * If any timer is already running, it will be overwritten.
 * @param camera
 * @param targetZoomFactor
 * @param easing
 */
export const tweenZoom = (
  camera: Unit,
  targetZoomFactor: number,
  easing?: CCC.Easing.FunctionUnit
) => {
  const { zoomFactorRange } = camera;
  const endZoomFactor = clamp(
    targetZoomFactor,
    zoomFactorRange.start,
    zoomFactorRange.end
  );

  const timer = Tween.create(v => (camera.zoomFactor = v), 60, {
    start: camera.zoomFactor,
    end: endZoomFactor,
    easing
  });
  timer.onComplete.push(stopTweenZoom.bind(undefined, camera));
  camera.targetZoomFactor = endZoomFactor;

  return (camera.zoomTimer = timer);
};
