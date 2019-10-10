import p5 from "p5";
import { Vector2D, Angle } from "@fal-works/creative-coding-core";
import { p } from "../shared";

export const line = (from: Vector2D.Unit, to: Vector2D.Unit): p5 =>
  p.line(from.x, from.y, to.x, to.y);

export const lineWithMargin = (
  from: Vector2D.Unit,
  to: Vector2D.Unit,
  margin: number
): p5 => {
  const angle = Angle.between(from, to);
  const offsetX = margin * Math.cos(angle);
  const offsetY = margin * Math.sin(angle);

  return p.line(
    from.x + offsetX,
    from.y + offsetY,
    to.x - offsetX,
    to.y - offsetY
  );
};
