export type SetPixelFunction = (
  logicalX: number,
  logicalY: number,
  red: number,
  green: number,
  blue: number,
  alpha: number
) => void;

export type SetPixelRowFunction = (
  logicalY: number,
  red: number,
  green: number,
  blue: number,
  alpha: number
) => void;
