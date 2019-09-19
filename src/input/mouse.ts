import { Mutable, Vector2D } from "@fal-works/creative-coding-core";
import { p, canvas } from "../shared";

export const logicalPosition: Mutable<Vector2D> = { x: 0, y: 0 };

export const updatePosition = () => {
  const factor = 1 / canvas.scaleFactor;
  logicalPosition.x = factor * p.mouseX;
  logicalPosition.y = factor * p.mouseY;
};
