import { Asset } from "./asset";

interface FrameParams {
  name?: string;
  frame: { x: number, y: number, w: number, h: number };
  rotated?: boolean;
  trimmed?: boolean;
  spriteSourceSize?: { x: number, y: number, w: number, h: number };
  sourceSize?: { w: number, h: number };
  pivot: { x: number, y: number };
};

export class Frame extends Asset {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;

  constructor({
    name = '',
    frame,
    rotated = false
  }: FrameParams) {
    super();

    this.name = name;

    const { x, y, h, w } = frame;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.rotated = rotated;
  }
}