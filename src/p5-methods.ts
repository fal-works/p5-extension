import p5 from "p5";

/**
 * Set of `p5` methods that are likely to be overwritten.
 */
export type P5Methods = Partial<{
  preload: p5["preload"];
  draw: p5["draw"];
  keyPressed: p5["keyPressed"];
  keyReleased: p5["keyReleased"];
  keyTyped: p5["keyTyped"];
  mouseMoved: p5["mouseMoved"];
  mouseDragged: p5["mouseDragged"];
  mousePressed: p5["mousePressed"];
  mouseReleased: p5["mouseReleased"];
  mouseClicked: p5["mouseClicked"];
  doubleClicked: p5["doubleClicked"];
  mouseWheel: p5["mouseWheel"];
  touchStarted: p5["touchStarted"];
  touchMoved: p5["touchMoved"];
  touchEnded: p5["touchEnded"];
}>;
