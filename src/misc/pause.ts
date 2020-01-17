import { p } from "../shared";

let paused = false;

/**
 * Pauses the sketch by `p.noLoop()`.
 */
export const pause = (): void => {
  p.noLoop();
  paused = true;
};

/**
 * Resumes the sketch by `p.loop()`.
 */
export const resume = (): void => {
  p.loop();
  paused = false;
};

/**
 * Pauses the sketch by `p.noLoop()`.
 * If already paused, resumes by `p.loop()`.
 */
export const pauseOrResume = (): void => {
  if (paused) resume();
  else pause();
};
