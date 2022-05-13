import { clamp } from "./utils";

const COLOR_MAX = 255;
const COLOR_MIN = 0;
const ALPHA_MAX = 1;
const ALPHA_MIN = 0;

export class Color {
  private _r: number = 0;
  private _g: number = 0;
  private _b: number = 0;
  private _a: number = 0;

  rNormal: number = 0;
  gNormal: number = 0;
  bNormal: number = 0;

  constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = a;
  };

  set r(value: number) {
    this._r = clamp(value, COLOR_MIN, COLOR_MAX);
    this.rNormal = value / COLOR_MAX;
  }

  get r() {
    return this._r;
  }

  set g(value: number) {
    this._g = clamp(value, COLOR_MIN, COLOR_MAX);
    this.gNormal = value / COLOR_MAX;
  }

  get g() {
    return this._g;
  }

  set b(value: number) {
    this._b = clamp(value, COLOR_MIN, COLOR_MAX);
    this.bNormal = value / COLOR_MAX;
  }

  get b() {
    return this._b;
  }

  set alpha(value: number) {
    this._a = clamp(value, ALPHA_MIN, ALPHA_MAX);
  }

  get alpha() {
    return this._a;
  }

  copy(color: Color): void {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.alpha = color.alpha;
  }

  equals(color: Color): boolean {
    return this.r === color.r &&
      this.g === color.g &&
      this.b === color.b &&
      this.alpha === color.alpha;
  }

}