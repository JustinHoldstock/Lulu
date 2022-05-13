import { default as VertexShaderSrc } from '../../shaders/vertex';
import { default as FragmentShaderSrc } from '../../shaders/fragment';
import { ActionComponent } from "../action-component";
import { SpriteComponent } from './sprite';
import { Color } from '../../math/color';
import { Texture } from '../../assets/texture';
import { Matrix3 } from '../../math/matrix3';
import { TransformComponent } from '../data-components/transform';

function createShader(ctx: WebGL2RenderingContext, type: number, source: string) {
  const shader = ctx.createShader(type) as WebGLShader;
  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);
  const success = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  ctx.deleteShader(shader);
}

function createProgram(ctx: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = ctx.createProgram() as WebGLProgram;
  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);
  const success = ctx.getProgramParameter(program, ctx.LINK_STATUS);
  if (success) {
    return program;
  }

  ctx.deleteProgram(program);
}

export class RendererComponent extends ActionComponent {
  canvas: HTMLCanvasElement;
  renderCtx: WebGL2RenderingContext | null = null;
  private postionAttrib: number | null = null;
  private textureCoordAttrib: number | null = null;
  private matrixUniform: WebGLUniformLocation | null = null;
  private colorUniform: WebGLUniformLocation | null = null;
  private imageUniform: WebGLUniformLocation | null = null;
  private resolutionUniform: WebGLUniformLocation | null = null;
  private buffers = {};

  private lastSpriteColor: Color = new Color(0, 0, 0, 0);
  private lastTexture: Texture | null = null;

  private RENDER_SIZE = 2;
  private RENDER_TYPE: number = 0;
  private RENDER_NORMALIZE = false;
  private RENDER_STRIDE = 0;
  private RENDER_OFFSET = 0;
  private RENDER_PRIM_TYPE = 0;

  clearColor: Color = new Color(0, 125, 125, 1);
  sprites: SpriteComponent[] = [];

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.canvas = canvas;
    this.renderCtx = this.canvas.getContext('webgl2', { alpha: false });
    if (!this.renderCtx) {
      return;
    }

    this.RENDER_TYPE = this.renderCtx.FLOAT;
    this.RENDER_PRIM_TYPE = this.renderCtx.TRIANGLES;

  }

  onAwake(): void {
    if (!this.renderCtx) {
      alert('Your browser does not support WebGL 2');
      return;
    }

    this.renderCtx.disable(this.renderCtx.DEPTH_TEST);
    this.renderCtx.enable(this.renderCtx.BLEND);
    this.renderCtx.blendFunc(this.renderCtx.SRC_ALPHA, this.renderCtx.ONE_MINUS_SRC_ALPHA);

    const program = this.createProgram(this.renderCtx);

    if (!program) {
      console.error('Could not create shader program');
      return;
    }

    // Vertex positions
    this.postionAttrib = this.renderCtx.getAttribLocation(program, "a_position");
    // Tex coords
    this.textureCoordAttrib = this.renderCtx.getAttribLocation(program, "a_texCoord");

    // transform matrix
    this.matrixUniform = this.renderCtx.getUniformLocation(program, 'u_matrix');
    this.resolutionUniform = this.renderCtx.getUniformLocation(program, 'u_resolution');
    // Colors
    this.colorUniform = this.renderCtx.getUniformLocation(program, "u_color");
    // image
    this.imageUniform = this.renderCtx.getUniformLocation(program, "u_image");

    // create buffers
    this.buffers = {
      positionBuffer: this.renderCtx.createBuffer(),
      uvBuffer: this.renderCtx.createBuffer(),
    };

    this.renderCtx.useProgram(program);

    // might want to put this back in the render loop, later
    this.renderCtx.activeTexture(this.renderCtx.TEXTURE0);

    this.resize();
  }

  resize() {
    if (!this.renderCtx) {
      return;
    }

    // TODO: Decide if we should move screen resolution to a set of constants
    // and then let the consumer decide how to configure the engine
    this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
    this.renderCtx.viewport(0, 0, this.renderCtx.canvas.width, this.renderCtx.canvas.height);
    this.renderCtx.uniform2f(this.resolutionUniform!, this.renderCtx.canvas.width, this.renderCtx.canvas.height);

  }

  render(_dt: number): void {
    if (!this.renderCtx) {
      return;
    }

    const { rNormal, gNormal, bNormal, alpha } = this.clearColor;
    this.renderCtx.clearColor(rNormal, gNormal, bNormal, alpha);

    this.renderCtx.clear(this.renderCtx.COLOR_BUFFER_BIT);

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite: SpriteComponent = this.sprites[i];
      if (!sprite.vertices.length || !sprite.isVisible) {
        continue;
      }

      const { color } = sprite;

      if (!this.lastSpriteColor.equals(color)) {
        this.renderCtx.uniform4f(this.colorUniform, color.rNormal, color.gNormal, color.bNormal, color.alpha);
        this.lastSpriteColor.copy(color);
      }

      this.renderCtx.bindBuffer(this.renderCtx.ARRAY_BUFFER, (this.buffers as any).positionBuffer)
      this.renderCtx.bufferData(this.renderCtx.ARRAY_BUFFER, new Float32Array(sprite.vertices), this.renderCtx.STATIC_DRAW);
      this.renderCtx.vertexAttribPointer(
        this.postionAttrib as any,
        this.RENDER_SIZE,
        this.RENDER_TYPE,
        this.RENDER_NORMALIZE,
        this.RENDER_STRIDE,
        this.RENDER_OFFSET
      );
      this.renderCtx.enableVertexAttribArray(this.postionAttrib as any);

      let matrix = sprite.transform!.worldMatrix;

      // Set the matrix.
      this.renderCtx.uniformMatrix3fv(this.matrixUniform, false, matrix);

      this.renderCtx.bindBuffer(this.renderCtx.ARRAY_BUFFER, (this.buffers as any).uvBuffer);
      // You need to use UVs from the textures, you goof
      this.renderCtx.bufferData(this.renderCtx.ARRAY_BUFFER, new Float32Array(sprite.uvs), this.renderCtx.STATIC_DRAW)
      this.renderCtx.vertexAttribPointer(
        this.textureCoordAttrib as any,
        this.RENDER_SIZE,
        this.RENDER_TYPE,
        this.RENDER_NORMALIZE,
        this.RENDER_STRIDE,
        this.RENDER_OFFSET
      );
      this.renderCtx.enableVertexAttribArray(this.textureCoordAttrib as any);

      if (!this.lastTexture || !this.lastTexture.equal(sprite.texture)) {
        this.setActiveTexture(sprite.texture);
        this.renderCtx.uniform1i(this.imageUniform, 0);
      }

      const count = sprite.vertices.length / 2;
      this.renderCtx.drawArrays(this.RENDER_PRIM_TYPE, this.RENDER_OFFSET, count);
    }
  }

  setActiveTexture(texture: Texture): void {
    if (!this.renderCtx) {
      return;
    }

    this.renderCtx.bindTexture(this.renderCtx.TEXTURE_2D, texture.glTexture);
    this.lastTexture = texture;
  }

  private createProgram(ctx: WebGL2RenderingContext): WebGLProgram | undefined {
    // Move this to component
    const vertexShader = createShader(ctx, ctx.VERTEX_SHADER, VertexShaderSrc);
    const fragmentShader = createShader(ctx, ctx.FRAGMENT_SHADER, FragmentShaderSrc);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    return createProgram(ctx, vertexShader, fragmentShader);
  }

  getContext(): WebGL2RenderingContext | null {
    return this.renderCtx;
  }
}