import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import { HtmlUtility, loopArray } from "./ccc";
import { setP5Instance, setCanvas } from "./shared";
import { createScaledCanvas, createFullScaledCanvas } from "./canvas";
import { onSetup } from "./setup";

/**
 * Settings data that should be passed to `startSketch()`.
 */
export interface SketchSettings {
  /**
   * The HTML element (or its ID) to which the canvas should belong.
   */
  htmlElement?: HTMLElement | string;

  /**
   * The logical (i.e. non-scaled) width of the canvas.
   */
  logicalCanvasWidth?: number;

  /**
   * The logical (i.e. non-scaled) height of the canvas.
   */
  logicalCanvasHeight: number;

  /**
   * Function that will be called in `p.setup()` after
   * creating the canvas and running all elements of `onSetup`.
   * The canvas will be automatically created and should not be manually created in this function.
   */
  initialize: () => void;

  /**
   * Function that should set several methods of `p5` instance, e.g. `p.draw()`.
   */
  setP5Methods: (p5Instance: p5) => void;

  /**
   * Option for canvas scaling. Set `null` to disable scaling.
   * Has no effect if `logicalCanvasWidth` is not specified.
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

  const {
    logicalCanvasWidth,
    logicalCanvasHeight,
    initialize,
    setP5Methods,
    fittingOption,
    renderer
  } = settings;

  new p5((p: p5): void => {
    setP5Instance(p);

    p.setup = (): void => {
      const physicalContainerSize = htmlElement
        ? HtmlUtility.getElementSize(htmlElement)
        : undefined;

      const scaledCanvas = logicalCanvasWidth
        ? createScaledCanvas({
            logicalSize: {
              width: logicalCanvasWidth,
              height: logicalCanvasHeight
            },
            physicalContainerSize,
            fittingOption,
            renderer
          })
        : createFullScaledCanvas({
            logicalHeight: logicalCanvasHeight,
            physicalContainerSize,
            renderer
          });
      setCanvas(scaledCanvas);

      loopArray(onSetup, listener => listener(p));
      onSetup.length = 0;

      initialize();
    };
    setP5Methods(p);
  }, htmlElement);
};
