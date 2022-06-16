import {
  Lulu,
  ActionComponent,
  SpriteComponent,
  TransformComponent,
  Entity,
  Vector2
} from "@lulu/engine";

export class PlayerMover extends ActionComponent {

  private transform: TransformComponent;
  private sprite: SpriteComponent;

  constructor(entity: Entity) {
    super();

    this.sprite = entity.getComponentByType(SpriteComponent);
    this.transform = entity.getComponentByType(TransformComponent)!;
  }

  update(dt: number) {
    let xDiff = 0;
    let yDiff = 0;

    if (Lulu.engine.input.keyDown('KeyW')) {
      yDiff = -100;
    } else if (Lulu.engine.input.keyDown('KeyS')) {
      yDiff = 100;
    }

    if (Lulu.engine.input.keyDown('KeyD')) {
      this.sprite.setAnimation('walk');
      this.transform.setScale(Math.abs(this.transform.scale.x));
      xDiff = 100;
    } else if (Lulu.engine.input.keyDown('KeyA')) {
      this.sprite.setAnimation('walk');
      this.transform.setScale(-Math.abs(this.transform.scale.x));
      xDiff = -100;
    } else {
      this.sprite.setAnimation('idle');
    }

    if (xDiff || yDiff) {
      this.transform.translate(xDiff * dt, yDiff * dt);
    }

  }
}