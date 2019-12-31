import * as CCC from "@fal-works/creative-coding-core";
import { ArrayList, ConstantFunction, unifyToArray } from "../../ccc";
import * as Mouse from "./mouse";

/**
 * The global flag that indicates if mouse events should be handled.
 */
export let active = true;

/**
 * Sets the global flag that indicates if mouse events should be handled.
 * @param flag
 */
export const setActive = (flag: boolean) => {
  active = flag;
};

/**
 * Callback function for handling mouse events.
 * If this returns `false`, the subsequent handlers will not be checked.
 * @param mousePosition The logical position of the mouse cursor.
 */
export type Handler = (mousePosition: CCC.Vector2D.Unit) => any;

/**
 * A `Handler` function with no effect.
 * @returns Nothing so that subsequent `Handler`s will be called.
 */
export const emptyHandler = ConstantFunction.returnVoid;

/**
 * A `Handler` function with no effect.
 * @returns `false` so that subsequent `Handler`s will be ignored.
 */
export const stopHandler = ConstantFunction.returnFalse;

/**
 * Run all `handlers`.
 * @param handlers
 * @returns `false` if any handler returned `false`. If not, `true`.
 */
const runHandlers = (handlers: Handler[]) => {
  let result = true;
  for (let i = 0; i < handlers.length; i += 1)
    result = handlers[i](Mouse.position) !== false && result;

  return result;
};

/**
 * A container of functions and variables that will be referred by each mouse event.
 */
export interface Listener {
  readonly onClicked: Handler[];
  readonly onPressed: Handler[];
  readonly onReleased: Handler[];
  readonly onMoved: Handler[];
  readonly onEnter: Handler[];
  readonly onLeave: Handler[];

  /**
   * A function that returns `true` if the mouse cursor is on the listening object.
   */
  isMouseOver: (mousePosition: CCC.Vector2D.Unit) => boolean;

  /**
   * A `Listener` listens for mouse events only if both `mouseOver` and `active` are `true`.
   * `active` is a property for activating/deactivating the `Listener` manually.
   */
  active: boolean;

  /**
   * A `Listener` listens for mouse events only if both `mouseOver` and `active` are `true`.
   * If `active` is `true, `mouseOver` will be automatically updated in `Mouse.Event.onMove` with the result of `isMouseOver()`.
   */
  mouseOver: boolean;
}

/**
 * Parameters for `createListener`.
 */
export interface ListenerCallbacks {
  onClicked?: Handler | Handler[];
  onPressed?: Handler | Handler[];
  onReleased?: Handler | Handler[];
  onMoved?: Handler | Handler[];
  onEnter?: Handler | Handler[];
  onLeave?: Handler | Handler[];

  /**
   * A function that returns `true` if the mouse cursor is on the listening object.
   */
  isMouseOver?: (mousePosition: CCC.Vector2D.Unit) => boolean;
}

/**
 * Creates a `Listener` that will be referred by each mouse event.
 * @param callbacks
 * @returns A `Listener` object.
 */
export const createListener = (callbacks: ListenerCallbacks): Listener => ({
  onClicked: unifyToArray(callbacks.onClicked),
  onPressed: unifyToArray(callbacks.onPressed),
  onReleased: unifyToArray(callbacks.onReleased),
  onMoved: unifyToArray(callbacks.onMoved),
  onEnter: unifyToArray(callbacks.onEnter),
  onLeave: unifyToArray(callbacks.onLeave),
  isMouseOver: callbacks.isMouseOver || ConstantFunction.returnTrue,
  active: true,
  mouseOver: false
});

/**
 * The `Listener` that will be called first by any mouse event.
 * Set a `Handler` function that returns `false` here for ignoring subsequent `Handler`s.
 */
export const topListener: Listener = createListener({});

/**
 * A stack of `Listener` objects that will be called by any mouse event.
 * Set a `Handler` function that returns `false` for ignoring subsequent `Handler`s.
 */
export const listenerStack = ArrayList.create<Listener>(32);

/**
 * The `Listener` that will be called last by any mouse event
 * after checking the `Handler`s in `listenerStack`.
 */
export const bottomListener: Listener = createListener({});

/**
 * Adds `listener` to `listenerStack`.
 * @param listener
 */
export const addListener = (listener: Listener) =>
  ArrayList.add(listenerStack, listener);

/**
 * Creates a new `Listener` and adds it to `listenerStack`.
 * @param callbacks
 * @returns Created `Listener`.
 */
export const addNewListener = (callbacks: ListenerCallbacks) => {
  const newListener = createListener(callbacks);
  ArrayList.add(listenerStack, newListener);

  return newListener;
};

/**
 * Removes `listener` from `listenerStack`.
 * @param listener
 */
export const removeListener = (listener: Listener) =>
  ArrayList.removeShiftElement(listenerStack, listener);

/**
 * A type of mouse events, e.g. `Clicked`, `Pressed` etc.
 */
const enum Type {
  Clicked,
  Pressed,
  Released,
  Moved
}

/**
 * @param type
 * @returns A function that gets the handler functions (corresponding to `type`) from `listener`.
 */
const createGetHandlers = (type: Type) => {
  switch (type) {
    case Type.Clicked:
      return (listener: Listener) => listener.onClicked;
    case Type.Pressed:
      return (listener: Listener) => listener.onPressed;
    case Type.Released:
      return (listener: Listener) => listener.onReleased;
    case Type.Moved:
      return (listener: Listener) => listener.onMoved;
  }
};

/**
 * @param type
 * @returns A function that gets the handler functions (corresponding to `type`) from `listener` and runs them.
 */
const createRunHandlers = (type: Type) => {
  const getHandlers = createGetHandlers(type);

  return (listener: Listener) => {
    if (!(listener.active && listener.mouseOver)) return true;

    return runHandlers(getHandlers(listener));
  };
};

/**
 * @param type
 * @returns A function that should be called by `type` and runs registered event handlers.
 */
const createOnEvent = (type: Type) => {
  const runHandlersOf = createRunHandlers(type);

  return () => {
    if (!active) return;

    if (runHandlersOf(topListener) === false) return;

    const listeners = listenerStack.array;
    let index = listenerStack.size - 1;
    while (index >= 0) {
      if (runHandlersOf(listeners[index]) === false) return;
      index -= 1;
    }

    runHandlersOf(bottomListener);
  };
};

export const onClicked = createOnEvent(Type.Clicked);
export const onPressed = createOnEvent(Type.Pressed);
export const onReleased = createOnEvent(Type.Released);

const setMouseOverFalse = (listener: Listener) => {
  listener.mouseOver = false;
  return true;
};

const updateRun = (listener: Listener) => {
  if (!listener.active) return;

  if (!listener.isMouseOver(Mouse.position)) {
    if (listener.mouseOver) {
      listener.mouseOver = false;
      return runHandlers(listener.onLeave);
    }
    return;
  }

  if (!listener.mouseOver) {
    listener.mouseOver = true;
    const onEnterResult = runHandlers(listener.onEnter) !== false;
    return runHandlers(listener.onMoved) !== false && onEnterResult;
  }

  return runHandlers(listener.onMoved);
};

export const onMoved = () => {
  if (!active) return;

  let processListener = updateRun;

  if (processListener(topListener) === false) {
    processListener = setMouseOverFalse;
  }

  const listeners = listenerStack.array;
  let index = listenerStack.size - 1;
  while (index >= 0) {
    if (processListener(listeners[index]) === false) {
      processListener = setMouseOverFalse;
    }
    index -= 1;
  }

  processListener(bottomListener);
};
