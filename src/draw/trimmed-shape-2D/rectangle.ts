import * as Polygon from "./polygon";

export const createCorner = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const x2 = x + width;
  const y2 = y + height;

  return Polygon.create([
    { x, y },
    { x: x2, y },
    { x: x2, y: y2 },
    { x, y: y2 },
  ]);
};

export const createCenter = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const halfWidth = 0.5 * width;
  const halfHeight = 0.5 * height;
  const x1 = x - halfWidth;
  const y1 = y - halfHeight;
  const x2 = x + halfWidth;
  const y2 = y + halfHeight;

  return Polygon.create([
    { x: x1, y: y1 },
    { x: x2, y: y1 },
    { x: x2, y: y2 },
    { x: x1, y: y2 },
  ]);
};
