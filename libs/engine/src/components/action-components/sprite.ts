import { Lulu } from "../..";
import { Animation } from "../../assets/animation";
import { Frame } from "../../assets/frame";
import { Texture } from "../../assets/texture";
import { Color } from "../../math/color";
import { ActionComponent } from "../action-component";
import { TransformComponent } from "../data-components/transform";

export class SpriteComponent extends ActionComponent {
  texture: Texture;
  transform: TransformComponent | undefined;
  color: Color = new Color();

  vertices: number[] = [];

  uvs: number[] = [];

  // UV cache so we don't have to recalc if we don't want to
  uvCache: Map<string, number[]> = new Map();

  vertUpdateScheduled: boolean = true;

  currentFrameIndex = 0;
  defaultFrame: Frame | undefined;
  frameTime = 150 * 0.001; // hardcoded ms wait between frames

  animations: Map<string, Animation> = new Map();
  animation: Animation | undefined;

  private currentFrameTime = 0;
  private isAnimated = false;

  constructor({
    imageSrc,
    color,
    animations,
  }: {
    imageSrc: string,
    color?: Color,
    animations?: Animation[],
  }) {
    super();

    if (color) {
      this.color.copy(color);
    }

    if (animations) {
      animations.forEach((anim) => this.animations.set(anim.name, anim));
      // Just use the first animation
      this.setAnimation(animations[0].name);
    }

    this.texture = new Texture('foo', imageSrc);
  }

  get isVisible() {
    // just check to see if its position is in bounds of the screen
    // we can do camera updates and all that later
    // and width/height, etc.
    if (this.transform) {
      const { worldPosition } = this.transform;
      const { x, y } = worldPosition;
      // if (this.entity?.name === 'player') {
      //   console.log(x, y)
      // }
      // NASTY BOUNDS CHECK
      if (
        x >= 0
        && y >= 0
        && x <= Lulu.engine.renderer.canvas.width
        && y <= Lulu.engine.renderer.canvas.height
      ) {
        return true;
      }

    }
    return false;
  }

  onAwake() {
    this.transform = this.entity?.getComponentByType(TransformComponent);

    if (!this.transform) {
      console.error(`SpriteComponent: ${this.entity?.id} is missing a transform component.`);
      return;
    }

    Lulu.engine.renderer.sprites.push(this);
  }

  updateFrames(dt: number) {
    this.currentFrameTime += dt;
    if (this.currentFrameTime > this.frameTime) {
      this.currentFrameTime = 0;
      this.currentFrameIndex++;

      if (this.currentFrameIndex > (this.animation?.frames as Frame[]).length - 1) {
        this.currentFrameIndex = 0;
      }

      this.vertUpdateScheduled = true;
    }
  }

  render(dt: number) {
    if (this.isAnimated) {
      this.updateFrames(dt);
    }

    if (this.vertUpdateScheduled && this.texture.loaded) {
      this.updateVerts();
      this.vertUpdateScheduled = false;
    }
  }

  setAnimation(name: string) {
    if (this.animation?.name === name) {
      return;
    }

    this.animation = this.animations.get(name);
    this.currentFrameIndex = 0;
    this.currentFrameTime = 0;
    this.isAnimated = (this.animation?.frames.length ?? 0) > 1;
  }

  private updateVerts() {
    // for now
    let frame = this.animation?.frames[this.currentFrameIndex];
    if (!frame) {

      if (!this.defaultFrame) {
        this.defaultFrame = new Frame({
          name: 'DEFAULT_FRAME',
          frame: {
            x: 0,
            y: 0,
            w: this.texture.image.width,
            h: this.texture.image.height,
          },
          pivot: {
            x: 0.5,
            y: 0.5,
          },
        });
      }

      frame = this.defaultFrame;
    }

    const width = frame.width;
    const height = frame.height;

    const originX = 0;
    const originY = 0;
    const originW = (frame.rotated ? height : width);
    const originH = (frame.rotated ? width : height);


    const x1 = originX - originW / 2;
    const x2 = originX + originW / 2;
    const y1 = originY - originH / 2;
    const y2 = originY + originH / 2;

    // Overwrite old verts
    this.vertices[0] = x1;
    this.vertices[1] = y1;

    this.vertices[2] = x2;
    this.vertices[3] = y1;

    this.vertices[4] = x1;
    this.vertices[5] = y2;

    this.vertices[6] = x1;
    this.vertices[7] = y2;

    this.vertices[8] = x2;
    this.vertices[9] = y1;

    this.vertices[10] = x2;
    this.vertices[11] = y2;

    const { width: texW, height: texH } = this.texture.image;
    const startX = frame.x / texW;
    const startY = frame.y / texH;
    const endX = (frame.x + frame.width) / texW;
    const endY = (frame.y + frame.height) / texH;

    let uvs = this.uvCache.get(frame.name);

    if (!uvs) {
      if (frame.rotated) {
        uvs = [
          endX, startY,    // TL
          endX, endY,      // TR
          startX, startY,    // BL
          startX, startY,  // BL
          endX, endY,    // TR
          startX, endY   // BR
        ];
      } else {
        uvs = [
          startX, startY, // TL
          endX, startY,   // TR
          startX, endY,   // BL
          startX, endY,   // BL
          endX, startY,   // TR
          endX, endY,     // BR
        ];
      }

      this.uvCache.set(frame.name, uvs);
    }

    this.uvs = uvs;

    /**
     * TODO:
     * - use source sprite dimensions
     * - use frame source size for proper size, not frame.size
     */
  }

}