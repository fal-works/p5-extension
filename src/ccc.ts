import * as CCC from "@fal-works/creative-coding-core";
export const {
  HtmlUtility,
  RectangleRegion,
  FitBox,
  Arrays: {
    FullName: { loopArray, unifyToArray }
  },
  ArrayList,
  Vector2D,
  Vector2D: {
    FullName: {
      vectorFromPolar,
      copyVector,
      zeroVector,
      constrainVector,
      setCartesian
    }
  },
  Coordinates2D: { distance },
  Numeric: { sin, cos, round, lerp, inverseLerp, max2, clamp },
  MathConstants,
  Random: {
    FullName: { randomValue, randomFromAbsolute }
  },
  Angle,
  HSV,
  ConstantFunction,
  Tween,
  Timer
} = CCC;

export const { ONE_OVER_SQUARE_ROOT_TWO, INVERSE255 } = MathConstants;
export const { TWO_PI } = Angle;
export const { returnVoid } = ConstantFunction;
