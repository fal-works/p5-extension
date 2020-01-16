import * as CCC from "@fal-works/creative-coding-core";
import { p } from "../shared";

/**
 * @returns The width and height of the window.
 */
export const getWindowSize = (): CCC.RectangleSize.Unit => ({
  width: p.windowWidth,
  height: p.windowHeight
});
