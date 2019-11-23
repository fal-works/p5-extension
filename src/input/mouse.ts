import * as CCC from "@fal-works/creative-coding-core";
import { ArrayList, Vector2D, RectangleRegion } from "../ccc";
import { p, canvas } from "../shared";
import { drawTranslated } from "../draw";

export const logicalPosition: CCC.Vector2D.Mutable.Unit = { x: 0, y: 0 };

export const updatePosition = () => {
  if (!canvas) return;

  const factor = 1 / canvas.scaleFactor;
  logicalPosition.x = factor * p.mouseX;
  logicalPosition.y = factor * p.mouseY;
};

/**
 * Sets mouse position to the center point of the canvas.
 */
export const setCenter = () =>
  Vector2D.Mutable.set(logicalPosition, canvas.logicalCenterPosition);

/**
 * Callback function for handling mouse events.
 * If this returns `false`, the subsequent handlers will not be checked.
 * @param mousePosition The logical position of the mouse cursor.
 */
export type EventCallback = (mousePosition: CCC.Vector2D.Unit) => boolean;

export const emptyCallback: EventCallback = () => true;
export const stopCallback: EventCallback = () => false;

export interface EventHandler {
  onClicked: EventCallback;
  onPressed: EventCallback;
  onReleased: EventCallback;
  onMoved: EventCallback;
}

export const createEventHandler = (
  handler: Partial<EventHandler>
): EventHandler => {
  return {
    onClicked: handler.onClicked || emptyCallback,
    onPressed: handler.onPressed || emptyCallback,
    onReleased: handler.onReleased || emptyCallback,
    onMoved: handler.onMoved || emptyCallback
  };
};

/**
 * The EventHandler that will be checked first by `onClicked` and other similar functions.
 * Set a callback that returns `false` here for ignoring other handlers in `handlerStack`.
 */
export const topEventHandler: EventHandler = createEventHandler({});

export const eventHandlerStack = ArrayList.create<EventHandler>(32);

/**
 * The EventHandler that will be checked last by `onClicked` and other similar functions
 * after checking all handlers in `eventHandlerStack`.
 */
export const bottomEventHandler: EventHandler = createEventHandler({});

/**
 * Creates an `EventHandler` and adds it to `eventHandlerStack`.
 * @param handler
 * @return Created `EventHandler`.
 */
export const addEventHandler = (handler: Partial<EventHandler>) => {
  const createdHandler = createEventHandler(handler);
  ArrayList.add(eventHandlerStack, createdHandler);

  return createdHandler;
};

/**
 * Removes `handler` from `eventHandlerStack`.
 * @param handler
 */
export const removeEventHandler = (handler: EventHandler) => {
  ArrayList.removeShiftElement(eventHandlerStack, handler);
};

const runCallback = (callback: EventCallback): boolean =>
  callback(logicalPosition);

const enum Event {
  Clicked,
  Pressed,
  Released,
  Moved
}

const createGetCallback = (event: Event) => {
  switch (event) {
    case Event.Clicked:
      return (handler: EventHandler) => handler.onClicked;
    case Event.Pressed:
      return (handler: EventHandler) => handler.onPressed;
    case Event.Released:
      return (handler: EventHandler) => handler.onReleased;
    case Event.Moved:
      return (handler: EventHandler) => handler.onMoved;
  }
};

const createOnEvent = (event: Event) => {
  const getCallback = createGetCallback(event);

  return () => {
    const runNext = runCallback(getCallback(topEventHandler));
    if (!runNext) return;

    const handlers = eventHandlerStack.array;
    let index = eventHandlerStack.size - 1;
    while (index >= 0) {
      const runNext = runCallback(getCallback(handlers[index]));
      if (!runNext) break;
      index -= 1;
    }

    runCallback(getCallback(bottomEventHandler));
  };
};

export const onClicked = createOnEvent(Event.Clicked);
export const onPressed = createOnEvent(Event.Pressed);
export const onReleased = createOnEvent(Event.Released);
export const onMoved = createOnEvent(Event.Moved);

export const drawAtCursor = (callback: () => void) =>
  drawTranslated(callback, logicalPosition.x, logicalPosition.y);

/**
 * Checks if the mouse cursor position is contained in the region of the canvas.
 * @return `true` if mouse cursor is on the canvas.
 */
export const isOnCanvas = () =>
  RectangleRegion.containsPoint(canvas.logicalRegion, logicalPosition, 0);
