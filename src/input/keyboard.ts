import { p } from "../shared";

export const anyKeyIsDown = (keyCodes: readonly number[]): boolean => {
  for (const keyCode of keyCodes) {
    if (p.keyIsDown(keyCode)) return true;
  }
  return false;
};
