import { Lulu } from "..";
import { RendererComponent } from "../components/action-components/renderer";
import { generateUUID } from "../utils/random";
import { Asset } from "./asset";

export class Texture extends Asset {
  loaded: boolean = false;

  id: string = generateUUID();
  name: string;
  source: string;

  image: HTMLImageElement = new Image();
  glTexture: WebGLTexture | null = null;

  constructor(name: string, source: string) {
    super();

    this.name = name;
    this.source = source;

    // Can't do anything without a canvas ctx
    const renderer = Lulu.engine.renderer;
    if (!renderer) {
      console.error('Texture: Renderer is missing');
      return;
    }

    this.image.onload = () => this.onLoad(renderer);

    // Trigger the texture to load
    this.image.src = source;
  }

  private onLoad(renderer: RendererComponent) {
    const ctx = renderer.getContext();
    if (!ctx) {
      return;
    }

    const level = 0;
    const internalFormat = ctx.RGBA;
    const srcFormat = ctx.RGBA;
    const srcType = ctx.UNSIGNED_BYTE;

    this.glTexture = ctx.createTexture();
    renderer.setActiveTexture(this);
    ctx.texImage2D(
      ctx.TEXTURE_2D,
      level,
      internalFormat,
      this.image.width,
      this.image.height,
      0,
      srcFormat,
      srcType,
      this.image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(this.image.width) && isPowerOf2(this.image.height)) {
      // Yes, it's a power of 2. Generate mips.
      ctx.generateMipmap(ctx.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    }

    this.loaded = true;
  }

  // Just doing an ID check
  equal(texture: Texture) {
    return this.id === texture.id;
  }
}

function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}