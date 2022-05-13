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
    if (Lulu.engine.input.keyDown('KeyD')) {
      this.sprite.setAnimation('walk');
      this.transform.setScale(Math.abs(this.transform.scale.x));
      this.transform.translate(100 * dt);
    } else if (Lulu.engine.input.keyDown('KeyA')) {
      this.sprite.setAnimation('walk');
      this.transform.setScale(-Math.abs(this.transform.scale.x));
      this.transform.translate(-100 * dt);
    } else {
      this.sprite.setAnimation('idle');
    }

    if (Lulu.engine.input.keyDown('KeyQ')) {
      this.transform.rotation += 100 * dt;
    } else if (Lulu.engine.input.keyDown('KeyE')) {
      this.transform.rotation -= 100 * dt;
    }

    if (Lulu.engine.input.keyDown('KeyR')) {
      this.transform.setScale(this.transform.scale.x + (10 * dt));
    } else if (Lulu.engine.input.keyDown('KeyT')) {
      this.transform.setScale(this.transform.scale.x - (10 * dt));
    }
  }
}