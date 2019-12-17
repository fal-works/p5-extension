import { returnVoid } from "../../ccc";
import { p } from "../../shared";
import * as Event from "./event";

export enum State {
  Default,
  MouseOver,
  Pressed,
  Inactive,
  Hidden
}

export interface Unit {
  /**
   * Mouse event listener.
   */
  readonly listener: Event.Listener;

  readonly drawDefault: () => void;
  readonly drawMouseOver: () => void;
  readonly drawPressed: () => void;
  readonly drawInactive: () => void;

  /**
   * Current function for drawing this button. May be changed depending on `state`.
   */
  draw: () => void;

  /**
   * Current state of this button.
   * For changing the state, use appropriate functions (e.g. `setStateDefault`) rather than assigning directly.
   */
  state: State;
}

export const setStateDefault = (button: Unit) => {
  button.state = State.Default;
  button.draw = button.drawDefault;
  button.listener.active = true;
};

export const setStateMouseOver = (button: Unit) => {
  button.state = State.MouseOver;
  button.draw = button.drawMouseOver;
  button.listener.active = true;
};

export const setStatePressed = (button: Unit) => {
  button.state = State.Pressed;
  button.draw = button.drawPressed;
  button.listener.active = true;
};

export const setStateInactive = (button: Unit) => {
  button.state = State.Inactive;
  button.draw = button.drawInactive;
  button.listener.active = false;
};

export const setStateHidden = (button: Unit) => {
  button.state = State.Hidden;
  button.draw = returnVoid;
  button.listener.active = false;
};

interface Parameters extends Event.ListenerCallbacks {
  drawDefault: () => void;
  drawMouseOver?: () => void;
  drawPressed?: () => void;
  drawInactive?: () => void;
  allowSubsequentEvents?: boolean;
}

/**
 * Creates a new `Button` unit.
 * @param parameters
 * @param addListenerOnStack Either the new listener should be automatically added to `Mouse.Event.listenerStack`.
 *   Defaults to `true`.
 */
export const create = (
  parameters: Parameters,
  addListenerOnStack = true
): Unit => {
  const drawDefault = parameters.drawDefault;
  const drawMouseOver = parameters.drawMouseOver || drawDefault;
  const drawPressed = parameters.drawPressed || drawDefault;
  const drawInactive = parameters.drawInactive || drawDefault;

  const draw = drawDefault;

  const listener = addListenerOnStack
    ? Event.addNewListener(parameters)
    : Event.createListener(parameters);

  const button = {
    listener,
    drawDefault,
    drawMouseOver,
    drawPressed,
    drawInactive,
    draw,
    state: State.Default
  };

  const allowSubsequentEvents = !!parameters.allowSubsequentEvents;

  const setMouseOver = () => {
    setStateMouseOver(button);
    return allowSubsequentEvents;
  };
  const setDefault = () => {
    setStateDefault(button);
    return allowSubsequentEvents;
  };
  const setPressed = () => {
    setStatePressed(button);
    return allowSubsequentEvents;
  };
  const autoCursor = () => p.cursor("auto");
  const pointerCursor = () => p.cursor("pointer");
  listener.onEnter.push(setMouseOver, pointerCursor);
  listener.onPressed.push(setPressed);
  listener.onClicked.push(setMouseOver);
  listener.onLeave.push(setDefault, autoCursor);
  if (!allowSubsequentEvents) {
    listener.onMoved.push(Event.stopHandler);
    listener.onReleased.push(Event.stopHandler);
  }

  return button;
};

/**
 * Calls `button.draw()`.
 * @param button
 */
export const draw = (button: Unit) => button.draw();
