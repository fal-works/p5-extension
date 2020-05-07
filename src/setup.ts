import p5 from "p5";

/**
 * A list of functions that will be called in `p.setup()` just after creating canvas in `startSketch()`.
 */
export const onSetup: ((p: p5) => void)[] = [];

/**
 * A list of functions that will be called just after instantiating a `p5` instance.
 */
export const onInstantiate: ((p: p5) => void)[] = [];
