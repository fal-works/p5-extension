import * as CCC from "@fal-works/creative-coding-core";
import { loopArray, vectorFromPolar } from "../ccc";

import { renderer } from "../shared";

const drawPath = (path: CCC.Bezier.PathSegment) => {
  const { controlPoint1, controlPoint2, targetPoint } = path;
  renderer.bezierVertex(
    controlPoint1.x,
    controlPoint1.y,
    controlPoint2.x,
    controlPoint2.y,
    targetPoint.x,
    targetPoint.y
  );
};

export const drawBezierCurve = (curve: CCC.Bezier.Curve): void => {
  const { startPoint, paths } = curve;

  renderer.vertex(startPoint.x, startPoint.y);
  loopArray(paths, drawPath);
};

const drawControlLine = (vertex: CCC.Bezier.VertexProperty): void => {
  const { point, controlLine } = vertex;
  const { x, y } = point;
  const controlPointOffset = vectorFromPolar(
    0.5 * controlLine.length,
    controlLine.angle
  );
  const controlX = controlPointOffset.x;
  const controlY = controlPointOffset.y;

  renderer.line(x - controlX, y - controlY, x + controlX, y + controlY);
};

export const drawBezierControlLines = (
  vertices: readonly CCC.Bezier.VertexProperty[]
): void => {
  loopArray(vertices, drawControlLine);
};
