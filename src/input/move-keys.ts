import * as CCC from "@fal-works/creative-coding-core";
import { Vector2D, ONE_OVER_SQUARE_ROOT_TWO } from "../ccc";
import { p } from "../shared";

export let horizontalMove: -1 | 0 | 1 = 0;
export let verticalMove: -1 | 0 | 1 = 0;
export const unitVector: CCC.Vector2D.Mutable.Unit = { x: 0, y: 0 };

export let up = false;
export let left = false;
export let down = false;
export let right = false;

const setVec = (x: number, y: number) =>
  Vector2D.Mutable.setCartesian(unitVector, x, y);

const update = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  horizontalMove = ((left ? -1 : 0) + (right ? 1 : 0)) as any;
  verticalMove = ((up ? -1 : 0) + (down ? 1 : 0)) as any;

  switch (horizontalMove) {
    case -1:
      switch (verticalMove) {
        case -1:
          setVec(-ONE_OVER_SQUARE_ROOT_TWO, -ONE_OVER_SQUARE_ROOT_TWO);
          break;
        case 0:
          setVec(-1, 0);
          break;
        case 1:
          setVec(-ONE_OVER_SQUARE_ROOT_TWO, ONE_OVER_SQUARE_ROOT_TWO);
          break;
      }
      break;
    case 0:
      switch (verticalMove) {
        case -1:
          setVec(0, -1);
          break;
        case 0:
          setVec(0, 0);
          break;
        case 1:
          setVec(0, 1);
          break;
      }
      break;
    case 1:
      switch (verticalMove) {
        case -1:
          setVec(ONE_OVER_SQUARE_ROOT_TWO, -ONE_OVER_SQUARE_ROOT_TWO);
          break;
        case 0:
          setVec(1, 0);
          break;
        case 1:
          setVec(ONE_OVER_SQUARE_ROOT_TWO, ONE_OVER_SQUARE_ROOT_TWO);
          break;
      }
      break;
  }
  /* eslint-enable */
};

export const onPressed = () => {
  switch (p.key) {
    case "w":
      up = true;
      break;
    case "a":
      left = true;
      break;
    case "s":
      down = true;
      break;
    case "d":
      right = true;
      break;
  }

  switch (p.keyCode) {
    case 38:
      up = true;
      break;
    case 37:
      left = true;
      break;
    case 40:
      down = true;
      break;
    case 39:
      right = true;
      break;
  }

  update();
};

export const onReleased = () => {
  switch (p.key) {
    case "w":
      up = false;
      break;
    case "a":
      left = false;
      break;
    case "s":
      down = false;
      break;
    case "d":
      right = false;
      break;
  }

  switch (p.keyCode) {
    case 38:
      up = false;
      break;
    case 37:
      left = false;
      break;
    case 40:
      down = false;
      break;
    case 39:
      right = false;
      break;
  }

  update();
};
