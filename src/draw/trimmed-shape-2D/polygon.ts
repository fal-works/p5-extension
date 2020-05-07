import * as CCC from "@fal-works/creative-coding-core";
import { lerp, inverseLerp, distance } from "../../ccc";
import { renderer } from "../../shared";

interface Path {
  readonly from: CCC.Vector2D.Unit;
  readonly to: CCC.Vector2D.Unit;
  readonly previousRatio: number;
  readonly nextRatio: number;
}
type Paths = readonly Path[];

/** For internal use in `createPaths()`. */
const createPathParameters = (
  from: CCC.Vector2D.Unit,
  to: CCC.Vector2D.Unit
) => {
  return {
    from,
    to,
    length: distance(from.x, from.y, to.x, to.y),
  };
};

/**
 * For internal use in `createPolygon()`.
 * @param vertices
 */
const createPaths = (vertices: readonly CCC.Vector2D.Unit[]) => {
  const vertexCount = vertices.length;
  const pathParameters = new Array(vertexCount);
  const lastIndex = vertexCount - 1;

  let totalLength = 0;

  for (let i = 0; i < lastIndex; i += 1) {
    const parameter = createPathParameters(vertices[i], vertices[i + 1]);
    pathParameters[i] = parameter;
    totalLength += parameter.length;
  }

  const lastParameter = createPathParameters(vertices[lastIndex], vertices[0]);
  pathParameters[lastIndex] = lastParameter;
  totalLength += lastParameter.length;

  const paths = new Array(vertexCount);

  for (let i = 0, lastThresholdRatio = 0; i < vertexCount; i += 1) {
    const parameters = pathParameters[i];
    const lengthRatio = parameters.length / totalLength;
    const nextThresholdRatio = lastThresholdRatio + lengthRatio;
    paths[i] = {
      from: parameters.from,
      to: parameters.to,
      previousRatio: lastThresholdRatio,
      nextRatio: nextThresholdRatio,
    };
    lastThresholdRatio = nextThresholdRatio;
  }

  return paths;
};

/** For internal use in `createPolygon()`. */
const getStartPathIndex = (startRatio: number, paths: Paths) => {
  for (let i = paths.length - 1; i >= 0; i -= 1) {
    if (paths[i].previousRatio <= startRatio) return i;
  }
  return 0;
};
/** For internal use in `createPolygon()`. */
const getEndPathIndex = (endRatio: number, paths: Paths) => {
  const { length } = paths;
  for (let i = 0; i < length; i += 1) {
    if (endRatio <= paths[i].nextRatio) return i;
  }
  return length - 1;
};

/** For internal use in `createPolygon()`. */
const drawVertexOnPath = (path: Path, lerpRatio: number) => {
  const { from, to } = path;
  renderer.vertex(lerp(from.x, to.x, lerpRatio), lerp(from.y, to.y, lerpRatio));
};

/**
 * Creates a function for drawing trimmed 2D polygon through `vertices`.
 * @param vertices
 * @returns Function for drawing trimmed 2D polygon.
 */
export const create = (vertices: readonly CCC.Vector2D.Unit[]) => {
  const paths = createPaths(vertices);

  return (startRatio: number, endRatio: number) => {
    const startPathIndex = getStartPathIndex(startRatio, paths);
    const endPathIndex = getEndPathIndex(endRatio, paths);
    const startPathRatio = inverseLerp(
      startRatio,
      paths[startPathIndex].previousRatio,
      paths[startPathIndex].nextRatio
    );
    const endPathRatio = inverseLerp(
      endRatio,
      paths[endPathIndex].previousRatio,
      paths[endPathIndex].nextRatio
    );

    renderer.beginShape();
    drawVertexOnPath(paths[startPathIndex], startPathRatio);
    if (startPathIndex !== endPathIndex) {
      for (let i = startPathIndex; i < endPathIndex; i += 1) {
        const nextVertex = paths[i].to;
        renderer.vertex(nextVertex.x, nextVertex.y);
      }
    }
    drawVertexOnPath(paths[endPathIndex], endPathRatio);
    renderer.endShape();
  };
};
