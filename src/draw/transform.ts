import p5 from "p5";
import { renderer } from "../shared";

/**
 * Runs `drawCallback` translated with `offsetX` and `offsetY`,
 * then restores the transformation by calling `translate()` with negative values.
 * Used to avoid calling `push()` and `pop()` frequently.
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
  renderer.translate(offsetX, offsetY);
  drawCallback();
  renderer.translate(-offsetX, -offsetY);
};

/**
 * Runs `drawCallback` rotated with `angle`,
 * then restores the transformation by calling `rotate()` with the negative value.
 * Used to avoid calling `push()` and `pop()` frequently.
 *
 * @param drawCallback
 * @param angle
 */
export const drawRotated = (
  drawCallback: () => void | p5,
  angle: number
): void => {
  renderer.rotate(angle);
  drawCallback();
  renderer.rotate(-angle);
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
  renderer.translate(offsetX, offsetY);
  drawRotated(drawCallback, angle);
  renderer.translate(-offsetX, -offsetY);
};

/**
 * Runs `drawCallback` scaled with `scaleFactor`,
 * then restores the transformation by scaling with the inversed factor.
 * Used to avoid calling `push()` and `pop()` frequently.
 *
 * @param drawCallback
 * @param scaleFactor
 */
export const drawScaled = (
  drawCallback: () => void | p5,
  scaleFactor: number
): void => {
  renderer.scale(scaleFactor);
  drawCallback();
  renderer.scale(1 / scaleFactor);
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
  renderer.translate(offsetX, offsetY);
  renderer.rotate(angle);
  renderer.scale(scaleFactor);
  drawCallback();
  renderer.scale(1 / scaleFactor);
  renderer.rotate(-angle);
  renderer.translate(-offsetX, -offsetY);
};

let lastTranslateX = 0;
let lastTranslateY = 0;
let lastRotateAngle = 0;
let lastScaleFactor = 1;

/**
 * Runs `translate()`. The given arguments will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTranslate()`.
 * @param x
 * @param y
 */
export const translate = (x: number, y: number) => {
  lastTranslateX = x;
  lastTranslateY = y;
  renderer.translate(x, y);
};

/**
 * Applies the inverse of the last transformation by `translate()`.
 */
export const undoTranslate = () => {
  renderer.translate(-lastTranslateX, -lastTranslateY);
};

/**
 * Runs `rotate()`. The given argument will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoRotate()`.
 * @param angle
 */
export const rotate = (angle: number) => {
  lastRotateAngle = angle;
  renderer.rotate(angle);
};

/**
 * Applies the inverse of the last transformation by `rotate()`.
 */
export const undoRotate = () => {
  renderer.rotate(-lastRotateAngle);
};

/**
 * Runs `scale()`. The given argument will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoScale()`.
 * @param scaleFactor
 */
export const scale = (scaleFactor: number) => {
  lastScaleFactor = scaleFactor;
  renderer.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `scale()`.
 */
export const undoScale = () => {
  renderer.scale(1 / lastScaleFactor);
};

/**
 * Runs `translate()` and `rotate()`. The given arguments will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTranslateRotate()`.
 * @param x
 * @param y
 * @param angle
 */
export const translateRotate = (x: number, y: number, angle: number) => {
  lastTranslateX = x;
  lastTranslateY = y;
  lastRotateAngle = angle;
  renderer.translate(x, y);
  renderer.rotate(angle);
};

/**
 * Applies the inverse of the last transformation by `translateRotate()`.
 */
export const undoTranslateRotate = () => {
  renderer.rotate(-lastRotateAngle);
  renderer.translate(-lastTranslateX, -lastTranslateY);
};

/**
 * Runs `translate()` and `scale()`. The given arguments will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTranslateScale()`.
 * @param x
 * @param y
 * @param scaleFactor
 */
export const translateScale = (x: number, y: number, scaleFactor: number) => {
  lastTranslateX = x;
  lastTranslateY = y;
  lastScaleFactor = scaleFactor;
  renderer.translate(x, y);
  renderer.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `translateScale()`.
 */
export const undoTranslateScale = () => {
  renderer.scale(1 / lastScaleFactor);
  renderer.translate(-lastTranslateX, -lastTranslateY);
};

/**
 * Runs `rotate()` and `scale()`. The given arguments will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoRotateScale()`.
 * @param angle
 * @param scaleFactor
 */
export const rotateScale = (angle: number, scaleFactor: number) => {
  lastRotateAngle = angle;
  lastScaleFactor = scaleFactor;
  renderer.rotate(angle);
  renderer.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `rotateScale()`.
 */
export const undoRotateScale = () => {
  renderer.scale(1 / lastScaleFactor);
  renderer.rotate(-lastRotateAngle);
};

/**
 * Runs `translate()`, `rotate()` and `scale()`. The given arguments will be saved.
 *
 * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTransform()`.
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
  renderer.translate(x, y);
  renderer.rotate(angle);
  renderer.scale(scaleFactor);
};

/**
 * Applies the inverse of the last transformation by `transform()`.
 */
export const undoTransform = () => {
  renderer.scale(1 / lastScaleFactor);
  renderer.rotate(-lastRotateAngle);
  renderer.translate(-lastTranslateX, -lastTranslateY);
};
