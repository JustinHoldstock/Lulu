import { Frame } from "../../assets/frame";

interface TPMeta {
  app: string;
  version: string;
  image: string;
  format: string;
  size: { w: number; h: number };
  scale: string;
  smartUpdate: string;
}

interface TPFrameData {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TPFrame {
  filename: string;
  frame: TPFrameData;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: TPFrameData;
  sourceSize: { w: number; h: number };
  pivot: { x: number; y: number };
}

interface TPFile {
  frames: TPFrame[];
  meta: TPMeta;
};

export function parseTexturePackerFrames(jsonFile: TPFile): Frame[] {
  return jsonFile.frames.map((tpFrame) => {

    const {
      filename,
      rotated,
      frame,
      pivot
    } = tpFrame;


    return new Frame({
      name: filename,
      rotated: rotated,
      frame: {
        x: frame.x,
        y: frame.y,
        w: rotated ? frame.h : frame.w,
        h: rotated ? frame.w : frame.h,
      },
      pivot: {
        x: pivot.x,
        y: pivot.y
      },
    });
  });
}