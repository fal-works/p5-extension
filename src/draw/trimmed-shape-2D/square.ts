import * as Rectangle from "./rectangle";

export const createCorner = (x: number, y: number, size: number) =>
  Rectangle.createCorner(x, y, size, size);

export const createCenter = (x: number, y: number, size: number) =>
  Rectangle.createCenter(x, y, size, size);
