import * as CCC from "@fal-works/creative-coding-core";
import { renderer } from "../shared";

/**
 * similar to p5 `curveVertex()` but takes a 2d-vector as argument.
 * @param vector
 */
export const curveVertexFromVector = (vector: CCC.Vector2D.Unit) =>
  renderer.curveVertex(vector.x, vector.y);

/**
 * Draws a curve through `vertices`.
 * @param vertices
 */
export const drawCurve = (vertices: readonly CCC.Vector2D.Unit[]) => {
  const { length } = vertices;
  renderer.beginShape();

  curveVertexFromVector(vertices[0]);
  for (let i = 0; i < length; i += 1) curveVertexFromVector(vertices[i]);
  curveVertexFromVector(vertices[length - 1]);

  renderer.endShape();
};

/**
 * Draws a curve through `vertices`, smoothly connecting the first and last vertex.
 * @param vertices
 */
export const drawCurveClosed = (vertices: readonly CCC.Vector2D.Unit[]) => {
  const { length } = vertices;
  renderer.beginShape();

  for (let i = 0; i < length; i += 1) curveVertexFromVector(vertices[i]);
  for (let i = 0; i < 3; i += 1) curveVertexFromVector(vertices[i]);

  renderer.endShape();
};
