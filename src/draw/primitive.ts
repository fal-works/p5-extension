import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import { Angle, sin, cos, TWO_PI } from "../ccc";
import { p } from "../shared";

export const line = (from: CCC.Vector2D.Unit, to: CCC.Vector2D.Unit): p5 =>
  p.line(from.x, from.y, to.x, to.y);

export const lineWithMargin = (
  from: CCC.Vector2D.Unit,
  to: CCC.Vector2D.Unit,
  margin: number
): p5 => {
  const angle = Angle.betweenPoints(from, to);
  const offsetX = margin * cos(angle);
  const offsetY = margin * sin(angle);

  return p.line(
    from.x + offsetX,
    from.y + offsetY,
    to.x - offsetX,
    to.y - offsetY
  );
};

export const lineAtOrigin = (destination: CCC.Vector2D.Unit): p5 =>
  p.line(0, 0, destination.x, destination.y);

export const circleAtOrigin = (size: number): p5 => p.circle(0, 0, size);

export const arcAtOrigin = (
  width: number,
  height: number,
  startRatio: number,
  endRatio: number,
  mode?: "chord" | "pie" | "open" | undefined,
  detail?: number | undefined
): p5 =>
  p.arc(
    0,
    0,
    width,
    height,
    startRatio * TWO_PI,
    endRatio * TWO_PI,
    mode,
    detail
  );

export const circularArcAtOrigin = (
  size: number,
  startRatio: number,
  endRatio: number,
  mode?: "chord" | "pie" | "open" | undefined,
  detail?: number | undefined
): p5 =>
  p.arc(0, 0, size, size, startRatio * TWO_PI, endRatio * TWO_PI, mode, detail);
