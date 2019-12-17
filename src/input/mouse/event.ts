import * as CCC from "@fal-works/creative-coding-core";
import { ArrayList, ConstantFunction } from "../../ccc";
import * as Mouse from "./mouse";

/**
 * Callback function for handling mouse events.
 * If this returns `false`, the subsequent handlers will not be checked.
 * @param mousePosition The logical position of the mouse cursor.
 */
export type Handler = (mousePosition: CCC.Vector2D.Unit) => boolean;

/**
 * A `Handler` function that does nothing and returns `true` so that subsequent `Handler`s will be called.
 */
export const emptyHandler = ConstantFunction.returnTrue;

/**
 * A `Handler` function that does nothing and returns `false` so that subsequent `Handler`s will be ignored.
 */
export const stopHandler = ConstantFunction.returnFalse;

/**
 * A container of functions and variables that will be referred by each mouse event.
 */
export interface Listener {
  /**
   * A function that returns `true` if the mouse cursor is on the listening object.
   */
  isMouseOver: (mousePosition: CCC.Vector2D.Unit) => boolean;

  onClicked: Handler;
  onPressed: Handler;
  onReleased: Handler;
  onMoved: Handler;
  onEnter: Handler;
  onLeave: Handler;

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
  /**
   * A function that returns `true` if the mouse cursor is on the listening object.
   */
  isMouseOver?: (mousePosition: CCC.Vector2D.Unit) => boolean;

  onClicked?: Handler;
  onPressed?: Handler;
  onReleased?: Handler;
  onMoved?: Handler;
  onEnter?: Handler;
  onLeave?: Handler;
}

const defaultListener: Listener = {
  isMouseOver: ConstantFunction.returnTrue,
  onClicked: emptyHandler,
  onPressed: emptyHandler,
  onReleased: emptyHandler,
  onMoved: emptyHandler,
  onEnter: emptyHandler,
  onLeave: emptyHandler,
  active: true,
  mouseOver: false
};

/**
 * Creates a `Listener` that will be referred by each mouse event.
 * @param callbacks
 * @returns A `Listener` object.
 */
export const createListener = (callbacks: ListenerCallbacks): Listener =>
  Object.assign({}, defaultListener, callbacks);

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
 * @param handlers
 * @returns Created `Listener`.
 */
export const addNewListener = (handlers: Partial<Listener>) => {
  const newListener = createListener(handlers);
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
 * @returns A function that gets the handler function (corresponding to `type`) from `listener`.
 */
const createGetHandler = (type: Type) => {
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
 * @returns A function that gets the handler function (corresponding to `type`) from `listener` and runs it.
 */
const createRunHandler = (type: Type) => {
  const getHandler = createGetHandler(type);

  return (listener: Listener) => {
    if (!(listener.active && listener.mouseOver)) return true;

    return getHandler(listener)(Mouse.position);
  };
};

/**
 * @param type
 * @returns A function that should be called by `type` and runs registered event handlers.
 */
const createOnEvent = (type: Type) => {
  const runHandler = createRunHandler(type);

  return () => {
    const runNext = runHandler(topListener);
    if (!runNext) return;

    const listeners = listenerStack.array;
    let index = listenerStack.size - 1;
    while (index >= 0) {
      const runNext = runHandler(listeners[index]);
      if (!runNext) return;
      index -= 1;
    }

    runHandler(bottomListener);
  };
};

export const onClicked = createOnEvent(Type.Clicked);
export const onPressed = createOnEvent(Type.Pressed);
export const onReleased = createOnEvent(Type.Released);

const setMouseOverFalse = (listener: Listener) => {
  listener.mouseOver = false;
  return true;
};

export const onMoved = () => {
  const updateRun = (listener: Listener) => {
    if (!listener.active) return true;

    if (!listener.isMouseOver(Mouse.position)) {
      if (listener.mouseOver) {
        listener.mouseOver = false;
        return listener.onLeave(Mouse.position);
      }
      return true;
    }

    if (!listener.mouseOver) {
      listener.mouseOver = true;
      const onEnterResult = listener.onEnter(Mouse.position);
      return listener.onMoved(Mouse.position) && onEnterResult;
    }

    return listener.onMoved(Mouse.position);
  };

  let processListener = updateRun;

  const runNext = processListener(topListener);
  if (!runNext) return;

  const listeners = listenerStack.array;
  let index = listenerStack.size - 1;
  while (index >= 0) {
    const runNext = processListener(listeners[index]);
    if (!runNext) {
      processListener = setMouseOverFalse;
    }
    index -= 1;
  }

  processListener(bottomListener);
};
