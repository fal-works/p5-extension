import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import { setP5Instance, setCanvas } from "./shared";
import { createScaledCanvas, createFullScaledCanvas } from "./canvas";
import { onSetup } from "./setup";
import { P5Methods } from "./p5-methods";
import { pauseOrResume } from "./misc";

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
   * Set of `p5` methods to be overwritten, e.g. `p.draw()`.
   */
  p5Methods: P5Methods;

  /**
   * Option for canvas scaling. Set `null` to disable scaling.
   * Has no effect if `logicalCanvasWidth` is not specified.
   */
  fittingOption?: CCC.FitBox.FittingOption | null;

  /**
   * `windowResized()` function to be assigned to the `p5` instance.
   */
  windowResized?: p5["windowResized"];

  /**
   * Function to be run if `resizeCanvas()` is called in
   * `ScalableCanvas.resizeIfNeeded()`.
   */
  onCanvasResized?: (p: p5) => void;

  /**
   * Renderer, either "p2d" or "webgl".
   */
  renderer?: "p2d" | "webgl";
}

/**
 * Function used if `P5Methods.keyTyped` is not specified.
 */
const defaultKeyTyped = (p: p5) => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "g":
      p.save("image.png");
      break;
  }
};

/**
 * Calls `new p5()` with the given settings information.
 * @param settings
 */
export const startSketch = (settings: SketchSettings): void => {
  const htmlElement =
    typeof settings.htmlElement === "string"
      ? CCC.HtmlUtility.getElementOrBody(settings.htmlElement)
      : settings.htmlElement;

  const {
    logicalCanvasWidth,
    logicalCanvasHeight,
    initialize,
    p5Methods,
    fittingOption,
    windowResized,
    onCanvasResized,
    renderer,
  } = settings;

  new p5((p: p5): void => {
    setP5Instance(p);

    p.setup = (): void => {
      const getPhysicalContainerSize = htmlElement
        ? CCC.HtmlUtility.getElementSize.bind(undefined, htmlElement)
        : undefined;

      const scaledCanvas = logicalCanvasWidth
        ? createScaledCanvas({
            logicalSize: {
              width: logicalCanvasWidth,
              height: logicalCanvasHeight,
            },
            getPhysicalContainerSize,
            fittingOption,
            onCanvasResized,
            renderer,
          })
        : createFullScaledCanvas({
            logicalHeight: logicalCanvasHeight,
            getPhysicalContainerSize,
            onCanvasResized,
            renderer,
          });
      setCanvas(scaledCanvas);

      CCC.Arrays.loopRunWithArgument(onSetup, p);
      onSetup.length = 0;

      initialize();
    };

    Object.assign(
      p,
      { keyTyped: defaultKeyTyped },
      { windowResized },
      p5Methods
    );
  }, htmlElement);
};
