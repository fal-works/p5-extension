import p5 from "p5";
import { ScaledCanvas } from "./canvas";

/**
 * The shared `p5` instance.
 */
export let p: p5;

/**
 * The shared `ScaledCanvas` instance.
 */
export let canvas: ScaledCanvas;

/**
 * The shared render.
 */
export let renderer: p5 | p5.Graphics;

/**
 * Sets the given `p5` instance to be shared.
 * @param instance
 */
export const setP5Instance = (instance: p5): void => {
  p = instance;
  renderer = p;
};

/**
 * Sets the given `ScaledCanvas` instance to be shared.
 * @param scaledCanvas
 */
export const setCanvas = (scaledCanvas: ScaledCanvas): void => {
  canvas = scaledCanvas;
};

/**
 * Sets the given `ScaledCanvas` instance to be shared.
 * This will affect many drawing functions of p5-extension.
 * @param rendererInstance
 */
export const setRenderer = (rendererInstance: p5 | p5.Graphics) => {
  renderer = rendererInstance;
};
