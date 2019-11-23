import p5 from "p5";
import { p } from "../shared";

/**
 * Runs `drawCallback` translated with `offsetX` and `offsetY`,
 * then restores the transformation by calling `p.translate()` with negative values.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param drawCallback
 * @param offsetX
 * @param offsetY
 */
export const drawTranslated = (
  drawCallback: () => void | p5,
  offsetX: number,
  offsetY: number
): void => {
  p.translate(offsetX, offsetY);
  drawCallback();
  p.translate(-offsetX, -offsetY);
};

/**
 * Runs `drawCallback` rotated with `angle`,
 * then restores the transformation by calling `p.rotate()` with the negative value.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param drawCallback
 * @param angle
 */
export const drawRotated = (
  drawCallback: () => void | p5,
  angle: number
): void => {
  p.rotate(angle);
  drawCallback();
  p.rotate(-angle);
};

/**
 * Composite of `drawTranslated()` and `drawRotated()`.
 *
 * @param drawCallback
 * @param offsetX
 * @param offsetY
 * @param angle
 */
export const drawTranslatedAndRotated = (
  drawCallback: () => void | p5,
  offsetX: number,
  offsetY: number,
  angle: number
): void => {
  p.translate(offsetX, offsetY);
  drawRotated(drawCallback, angle);
  p.translate(-offsetX, -offsetY);
};

/**
 * Runs `drawCallback` scaled with `scaleFactor`,
 * then restores the transformation by scaling with the inversed factor.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param drawCallback
 * @param scaleFactor
 */
export const drawScaled = (
  drawCallback: () => void | p5,
  scaleFactor: number
): void => {
  p.scale(scaleFactor);
  drawCallback();
  p.scale(1 / scaleFactor);
};

/**
 * Composite of `drawTranslated()`, `drawRotated()` and `drawScaled()`.
 *
 * @param drawCallback
 * @param offsetX
 * @param offsetY
 * @param angle
 * @param scaleFactor
 */
export const drawTransformed = (
  drawCallback: () => void | p5,
  offsetX: number,
  offsetY: number,
  angle: number,
  scaleFactor: number
): void => {
  p.translate(offsetX, offsetY);
  p.rotate(angle);
  p.scale(scaleFactor);
  drawCallback();
  p.scale(1 / scaleFactor);
  p.rotate(-angle);
  p.translate(-offsetX, -offsetY);
};

let lastTranslateX = 0;
let lastTranslateY = 0;
let lastRotateAngle = 0;
let lastScaleFactor = 1;

/**
 * Runs `translate()`. The given arguments will be saved.
 * @param x
 * @param y
 */
export const translate = (x: number, y: number) => {
  lastTranslateX = x;
  lastTranslateY = y;
  p.translate(x, y);
};

/**
 * Applies the inverse of the last transformation by `translate()`.
 */
export const undoTranslate = () => {
  p.translate(-lastTranslateX, -lastTranslateY);
};

/**
 * Runs `rotate()`. The given argument will be saved.
 * @param angle
 */
export const rotate = (angle: number) => {
  lastRotateAngle = angle;
  p.rotate(angle);
};

/**
 * Applies the inverse of the last transformation by `rotate()`.
 */
export const undoRotate = () => {
  p.rotate(-lastRotateAngle);
};

/**
 * Runs `scale()`. The given argument will be saved.
 * @param scaleFactor
 */
export const scale = (scaleFactor: number) => {
  lastScaleFactor = scaleFactor;
  p.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `scale()`.
 */
export const undoScale = () => {
  p.scale(1 / lastScaleFactor);
};

/**
 * Runs `translate()` and `rotate()`. The given arguments will be saved.
 * @param x
 * @param y
 * @param angle
 */
export const translateRotate = (x: number, y: number, angle: number) => {
  lastTranslateX = x;
  lastTranslateY = y;
  lastRotateAngle = angle;
  p.translate(x, y);
  p.rotate(angle);
};

/**
 * Applies the inverse of the last transformation by `translateRotate()`.
 */
export const undoTranslateRotate = () => {
  p.rotate(-lastRotateAngle);
  p.translate(-lastTranslateX, -lastTranslateY);
};

/**
 * Runs `translate()` and `scale()`. The given arguments will be saved.
 * @param x
 * @param y
 * @param scaleFactor
 */
export const translateScale = (x: number, y: number, scaleFactor: number) => {
  lastTranslateX = x;
  lastTranslateY = y;
  lastScaleFactor = scaleFactor;
  p.translate(x, y);
  p.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `translateScale()`.
 */
export const undoTranslateScale = () => {
  p.scale(1 / lastScaleFactor);
  p.translate(-lastTranslateX, -lastTranslateY);
};

/**
 * Runs `rotate()` and `scale()`. The given arguments will be saved.
 * @param angle
 * @param scaleFactor
 */
export const rotateScale = (angle: number, scaleFactor: number) => {
  lastRotateAngle = angle;
  lastScaleFactor = scaleFactor;
  p.rotate(angle);
  p.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `rotateScale()`.
 */
export const undoRotateScale = () => {
  p.scale(1 / lastScaleFactor);
  p.rotate(-lastRotateAngle);
};

/**
 * Runs `translate()`, `rotate()` and `scale()`. The given arguments will be saved.
 * @param x
 * @param y
 * @param angle
 * @param scaleFactor
 */
export const transform = (
  x: number,
  y: number,
  angle: number,
  scaleFactor: number
) => {
  lastTranslateX = x;
  lastTranslateY = y;
  lastRotateAngle = angle;
  lastScaleFactor = scaleFactor;
  p.translate(x, y);
  p.rotate(angle);
  p.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `transform()`.
 */
export const undoTransform = () => {
  p.scale(1 / lastScaleFactor);
  p.rotate(-lastRotateAngle);
  p.translate(-lastTranslateX, -lastTranslateY);
};
