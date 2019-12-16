import * as CCC from "@fal-works/creative-coding-core";
import { Vector2D, RectangleRegion } from "../../ccc";
import { drawTranslated } from "../../draw";
import { p, canvas } from "../../shared";

type Position = CCC.Vector2D.Mutable.Unit;

/**
 * Logical position (independent of the canvas scale factor) of the mouse.
 */
export const position: Position = { x: 0, y: 0 };

/**
 * Logical position (independent of the canvas scale factor) of the mouse
 * at the previous frame.
 */
export const previousPosition: Position = { x: 0, y: 0 };

/**
 * Logical displacement (independent of the canvas scale factor) of the mouse
 * from the previous frame.
 */
export const displacement: Position = { x: 0, y: 0 };

/**
 * Updates `position`, `previousPosition` and `displacement` of the mouse cursor
 * calculating from its physical position.
 */
export const updatePosition = () => {
  if (!canvas) return;

  const factor = 1 / canvas.scaleFactor;

  Vector2D.Mutable.set(previousPosition, position); // update previous
  Vector2D.Mutable.setCartesian(position, factor * p.mouseX, factor * p.mouseY); // update current
  Vector2D.Assign.subtract(position, previousPosition, displacement); // update displacement
};

/**
 * Sets mouse position to the center point of the canvas.
 */
export const setCenter = () =>
  Vector2D.Mutable.set(position, canvas.logicalCenterPosition);

/**
 * Runs `callback` translated with the logical mouse position.
 * @param callback
 */
export const drawAtCursor = (callback: () => void) =>
  drawTranslated(callback, position.x, position.y);

/**
 * Checks if the mouse cursor position is contained in the region of the canvas.
 * @returns `true` if mouse cursor is on the canvas.
 */
export const isOnCanvas = () =>
  RectangleRegion.containsPoint(canvas.logicalRegion, position, 0);
