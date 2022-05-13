import { Lulu } from "../..";
import { Matrix3 } from "../../math/matrix3";
import { Vector2 } from "../../math/vector2";
import { DataComponent } from "../data-component";

export class TransformComponent extends DataComponent {
  readonly position: Vector2 = new Vector2();
  readonly scale: Vector2 = new Vector2(1, 1);

  worldPosition: Vector2 = new Vector2();

  private _rotation: number = 0;
  private _rotationRads: number = 0;

  localMatrix = Matrix3.identity();
  worldMatrix = Matrix3.identity();

  get rotation(): number {
    return this._rotation;
  }

  set rotation(degrees: number) {
    this._rotation = degrees;
    this._rotationRads = 0.01745329252 * degrees;
    this.updateLocalMatrix();
  }

  get rads(): number {
    return this._rotationRads;
  }

  set rads(rads: number) {
    this._rotationRads = rads;
    this._rotation = rads * 57.295779513;
    this.updateLocalMatrix();
  }

  translate(x: number = 0, y: number = 0) {
    this.setPosition(
      this.position.x + x,
      this.position.y + y
    );
  }

  setPosition(x = this.position.x, y = this.position.y) {
    this.position.x = x;
    this.position.y = y;

    this.updateWorldPosition();

    this.updateLocalMatrix();
  }

  updateWorldPosition() {
    const { worldPosition } = this.entity?.parent?.getComponentByType(TransformComponent) ?? {};
    if (worldPosition) {
      this.worldPosition.x = worldPosition.x + this.position.x;
      this.worldPosition.y = worldPosition.y + this.position.y;
    } else {
      this.worldPosition.x = this.position.x;
      this.worldPosition.y = this.position.y;
    }
  }

  setScale(x = this.scale.x, y = this.scale.y): void {
    this.scale.x = x;
    this.scale.y = y;

    this.updateLocalMatrix();
  }

  updateLocalMatrix(): void {
    const translationMatrix = Matrix3.translation(this.position.x, this.position.y);
    const rotationMatrix = Matrix3.rotation(this.rads);
    const scaleMatrix = Matrix3.scaling(this.scale.x, this.scale.y);

    let matrix = Matrix3.multiply(translationMatrix, rotationMatrix);
    matrix = Matrix3.multiply(matrix, scaleMatrix);

    Matrix3.copy(matrix, this.localMatrix);

    this.updateWorldMatrix();
  }

  updateWorldMatrix(parentMatrix?: Float32Array): void {
    if (!parentMatrix && this.entity?.parent) {
      const parentTransform = this.entity.parent.getComponentByType(TransformComponent);

      if (parentTransform) {
        parentMatrix = parentTransform.worldMatrix;
      }
    }

    if (!parentMatrix) {
      Matrix3.copy(this.localMatrix, this.worldMatrix);
    } else {
      const newWorldMatrix = Matrix3.multiply(parentMatrix, this.localMatrix);
      Matrix3.copy(newWorldMatrix, this.worldMatrix);
    }

    // update matrices for all children
    this.entity?.children.forEach((child) => {
      const transform = child.getComponentByType(TransformComponent);
      if (transform) {
        transform.updateWorldMatrix(this.worldMatrix);
      }
    });
  }
}