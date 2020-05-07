import * as CCC from "@fal-works/creative-coding-core";
export const {
  RectangleRegion,
  FitBox,
  Arrays: {
    FullName: { loopArray, unifyToArray },
  },
  ArrayList,
  Vector2D,
  Vector2D: {
    FullName: {
      vectorFromPolar,
      copyVector,
      zeroVector,
      constrainVector,
      setCartesian,
    },
  },
  Coordinates2D: { distance },
  Numeric: { sin, cos, round, lerp, inverseLerp, max2, clamp },
  MathConstants: { ONE_OVER_SQUARE_ROOT_TWO, INVERSE255 },
  Random: {
    FullName: { randomValue, randomSigned },
  },
  Angle,
  Angle: { TWO_PI },
  HSV,
  ConstantFunction,
  ConstantFunction: { returnVoid },
  Tween,
  Timer,
} = CCC;
