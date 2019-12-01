import { randomFromAbsolute } from "../ccc";
import { p, canvas } from "../shared";

export const enum ShakeType {
  DEFAULT = "DEFAULT",
  VERTICAL = "VERTICAL",
  HORIZONTAL = "HORIZONTAL"
}

let shakeFactor = 0;
let shakeDecayFactor = 0;
let shakeType = ShakeType.DEFAULT;

export const setShake = (
  initialFactor: number,
  decayFactor: number,
  type: ShakeType = ShakeType.DEFAULT,
  force = false
) => {
  if (decayFactor >= 1) return; // TODO: warning message
  if (!force && shakeFactor !== 0) return;

  shakeFactor = initialFactor;
  shakeDecayFactor = decayFactor;
  shakeType = type;
};

export const applyShake = () => {
  if (shakeFactor === 0) return;

  const { width, height } = canvas.logicalSize;
  const xShake =
    shakeType === ShakeType.VERTICAL
      ? 0
      : randomFromAbsolute(shakeFactor * width);
  const yShake =
    shakeType === ShakeType.HORIZONTAL
      ? 0
      : randomFromAbsolute(shakeFactor * height);
  p.translate(xShake, yShake);

  shakeFactor *= shakeDecayFactor;
  if (shakeFactor < 0.001) shakeFactor = 0;
};
