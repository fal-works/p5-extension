import {
  Bezier,
  ArrayUtility,
  Vector2D
} from "@fal-works/creative-coding-core";

import { p } from "../shared";

const drawPath = (path: Bezier.PathSegment) => {
  const { controlPoint1, controlPoint2, targetPoint } = path;
  p.bezierVertex(
    controlPoint1.x,
    controlPoint1.y,
    controlPoint2.x,
    controlPoint2.y,
    targetPoint.x,
    targetPoint.y
  );
};

export const drawBezierCurve = (curve: Bezier.Curve): void => {
  const { startPoint, paths } = curve;

  p.vertex(startPoint.x, startPoint.y);
  ArrayUtility.loop(paths, drawPath);
};

const drawControlLine = (vertex: Bezier.VertexProperty): void => {
  const { point, controlLine } = vertex;
  const { x, y } = point;
  const controlPointOffset = Vector2D.fromPolar(
    0.5 * controlLine.length,
    controlLine.angle
  );
  const controlX = controlPointOffset.x;
  const controlY = controlPointOffset.y;

  p.line(x - controlX, y - controlY, x + controlX, y + controlY);
};

export const drawBezierControlLines = (
  vertices: readonly Bezier.VertexProperty[]
): void => {
  ArrayUtility.loop(vertices, drawControlLine);
};
