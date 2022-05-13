import { Entity } from './entities/entity';
import { RendererComponent } from './components/action-components/renderer';
import { TransformComponent } from './components/data-components/transform';
import { SpriteComponent } from './components/action-components/sprite';
import { InputComponent } from './components/action-components/input';

interface EngineConfig {
  renderer?: {}
}

const engineConfigDefault: EngineConfig = {
  renderer: {

  }
};

export class Lulu {
  static engine: Lulu;

  private entities: Entity[] = [];
  private boundRender: (dt: number) => void;
  private prevDelta = 0;


  renderer: RendererComponent;
  input: InputComponent;

  constructor(canvasEl: HTMLCanvasElement, config: EngineConfig = engineConfigDefault) {
    // I don't know how I feel about this
    Lulu.engine = this;

    // Holds components for the engine instance. Like inputs, renderer, etc
    const engineEntity = new Entity('renderer');
    this.renderer = new RendererComponent(canvasEl);

    engineEntity.addComponent(this.renderer);
    this.renderer.enabled = true;

    this.input = new InputComponent();
    engineEntity.addComponent(this.input);
    this.input.enabled = true;


    this.boundRender = this._loop.bind(this);

    this.start();

    window.addEventListener('resize', () => this.renderer.resize());
  }

  start(): void {
    this._loop(0);
  }

  // OPTIMIZE THIS LATER
  update(dt: number = 0) {
    this.input.update();

    this.entities.forEach((entity) => entity.preUpdate(dt));
    this.entities.forEach((entity) => entity.preRender(dt));
    this.entities.forEach((entity) => entity.update(dt));
    this.entities.forEach((entity) => entity.render(dt));
    this.entities.forEach((entity) => entity.postUpdate(dt));
    this.entities.forEach((entity) => entity.postRender(dt));

    this.renderer.render(dt);
  }

  private _loop(timestamp: number) {
    const diff = timestamp - this.prevDelta;
    this.prevDelta = timestamp;

    const dt = diff * 0.001; // seconds

    this.update(dt);
    requestAnimationFrame(this.boundRender);
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
}