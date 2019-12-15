import * as CCC from "@fal-works/creative-coding-core";
import { ArrayList, Vector2D, RectangleRegion } from "../ccc";
import { p, canvas } from "../shared";
import { drawTranslated } from "../draw";

type Position = CCC.Vector2D.Mutable.Unit;

/**
 * Logical position (independent of the canvas scale factor) of the mouse.
 */
export const position: Position = { x: 0, y: 0 };

/**
 * Logical position (independent of the canvas scale factor) of the mouse
 * at the previous frame.
 */
export const previousPosition: Position = { x: 0, y: 0 };

/**
 * Logical displacement (independent of the canvas scale factor) of the mouse
 * from the previous frame.
 */
export const displacement: Position = { x: 0, y: 0 };

export const updatePosition = () => {
  if (!canvas) return;

  const factor = 1 / canvas.scaleFactor;

  Vector2D.Mutable.set(previousPosition, position); // update previous
  Vector2D.Mutable.setCartesian(position, factor * p.mouseX, factor * p.mouseY); // update current
  Vector2D.Assign.subtract(position, previousPosition, displacement); // update displacement
};

/**
 * Sets mouse position to the center point of the canvas.
 */
export const setCenter = () =>
  Vector2D.Mutable.set(position, canvas.logicalCenterPosition);

/**
 * Callback function for handling mouse events.
 * If this returns `false`, the subsequent handlers will not be checked.
 * @param mousePosition The logical position of the mouse cursor.
 */
export type EventCallback = (mousePosition: CCC.Vector2D.Unit) => boolean;

export const emptyCallback: EventCallback = () => true;
export const stopCallback: EventCallback = () => false;

/**
 * A set of functions that will be run triggered by each mouse event.
 */
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
 * The `EventHandler` that will be called first by any mouse event.
 * Set a callback that returns `false` here for ignoring subsequent handlers.
 */
export const topEventHandler: EventHandler = createEventHandler({});

/**
 * A stack of `EventHandler` objects that will be called by any mouse event.
 * Set a callback that returns `false` for ignoring subsequent handlers.
 */
export const eventHandlerStack = ArrayList.create<EventHandler>(32);

/**
 * The `EventHandler` that will be called last by any mouse event
 * after checking the handlers in `eventHandlerStack`.
 */
export const bottomEventHandler: EventHandler = createEventHandler({});

/**
 * Creates an `EventHandler` and adds it to `eventHandlerStack`.
 * @param handler
 * @returns Created `EventHandler`.
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

const createRunCallback = (event: Event) => {
  const getCallback = createGetCallback(event);

  return (handler: EventHandler) => getCallback(handler)(position);
};

const createOnEvent = (event: Event) => {
  const runCallback = createRunCallback(event);

  return () => {
    const runNext = runCallback(topEventHandler);
    if (!runNext) return;

    const handlers = eventHandlerStack.array;
    let index = eventHandlerStack.size - 1;
    while (index >= 0) {
      const runNext = runCallback(handlers[index]);
      if (!runNext) break;
      index -= 1;
    }

    runCallback(bottomEventHandler);
  };
};

export const onClicked = createOnEvent(Event.Clicked);
export const onPressed = createOnEvent(Event.Pressed);
export const onReleased = createOnEvent(Event.Released);
export const onMoved = createOnEvent(Event.Moved);

export const drawAtCursor = (callback: () => void) =>
  drawTranslated(callback, position.x, position.y);

/**
 * Checks if the mouse cursor position is contained in the region of the canvas.
 * @returns `true` if mouse cursor is on the canvas.
 */
export const isOnCanvas = () =>
  RectangleRegion.containsPoint(canvas.logicalRegion, position, 0);
