import p5 from "p5";
import { p } from "../shared";

export const graphicsToImage = (graphics: p5.Graphics): p5.Image => {
  const g = (graphics as any) as p5; // eslint-disable-line @typescript-eslint/no-explicit-any
  const { width, height } = g;
  const image = p.createImage(width, height);
  image.copy(graphics, 0, 0, width, height, 0, 0, width, height);

  return image;
};
