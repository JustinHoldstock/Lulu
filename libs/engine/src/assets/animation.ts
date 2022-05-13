import { Asset } from "./asset";
import { Frame } from "./frame";

export class Animation extends Asset {
  name: string;
  frames: Frame[];

  constructor(name: string, frames: Frame[]) {
    super();
    this.name = name;
    this.frames = frames;
  }
};