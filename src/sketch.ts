import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import { HtmlUtility, loopArray } from "./ccc";
import { setP5Instance, setCanvas } from "./shared";
import { createScaledCanvas } from "./canvas";
import { onSetup } from "./setup";

/**
 * Settings data that should be passed to `startSketch()`.
 */
export interface SketchSettings {
  /**
   * The HTML element (or its ID) to which the canvas should belong.
   */
  htmlElement: HTMLElement | string;

  /**
   * The logical (i.e. non-scaled) size of the canvas, e.g. `{ width: 640, height: 480 }`;
   */
  logicalCanvasSize: CCC.RectangleSize.Unit;

  /**
   * Function that will be called in `p.setup()` just after creating the canvas.
   * The canvas will be automatically created and should not be manually created in this function.
   */
  initialize: () => void;

  /**
   * Function that should set several methods of `p5` instance, e.g. `p.draw()`.
   */
  setP5Methods: (p5Instance: p5) => void;

  /**
   * Option for canvas scaling. Set `null` to disable scaling.
   */
  fittingOption?: CCC.FitBox.FittingOption | null;

  /**
   * Renderer, either "p2d" or "webgl".
   */
  renderer?: "p2d" | "webgl";
}

/**
 * Calls `new p5()` with the given settings information.
 * @param settings
 */
export const startSketch = (settings: SketchSettings): void => {
  const htmlElement =
    typeof settings.htmlElement === "string"
      ? HtmlUtility.getElementOrBody(settings.htmlElement)
      : settings.htmlElement;

  new p5((p: p5): void => {
    setP5Instance(p);
    p.setup = (): void => {
      setCanvas(
        createScaledCanvas(
          htmlElement,
          settings.logicalCanvasSize,
          settings.fittingOption,
          settings.renderer
        )
      );
      loopArray(onSetup, listener => listener(p));
      onSetup.length = 0;
      settings.initialize();
    };
    settings.setP5Methods(p);
  }, htmlElement);
};
