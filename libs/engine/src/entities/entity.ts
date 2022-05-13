import { ActionComponent } from "../components/action-component";
import { Component } from "../components/component";
import { DataComponent } from "../components/data-component";
import { TransformComponent } from "../components/data-components/transform";
import { generateUUID } from "../utils/random";

export class Entity {
  readonly id: string = generateUUID();
  readonly components: { [id: string]: Component } = {};
  readonly actionComponents: ActionComponent[] = [];
  readonly dataComponents: DataComponent[] = [];

  name: string | undefined;
  children: Entity[] = [];
  parent: Entity | undefined;


  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }

  /**
   * Add a component to this entity if it hasn't already been added
   * @param component - Component to attach to this entity
   * @param enable - If provided, will enable or disable the component when it's added
   */
  addComponent(component: Component): void {
    const { id } = component;
    if (!this.components[id]) {
      this.components[id] = component;

      if (component instanceof ActionComponent) {
        this.actionComponents.push(component);
      } else if (component instanceof DataComponent) {
        this.dataComponents.push(component);
      }
    }

    component.entity = this;
  }

  /**
   * Remove a component from this entity.
   * @param id - Id of the component to remove
   */
  removeComponentById(id: string): void {
    const component = this.components[id];
    if (component) {
      delete this.components[id];
      component.entity = undefined;

      if (component instanceof ActionComponent) {
        const index = this.actionComponents.indexOf(component);
        this.actionComponents.splice(index, 1);
      } else if (component instanceof DataComponent) {
        const index = this.dataComponents.indexOf(component);
        this.dataComponents.splice(index, 1);
      }
    }
  }

  /**
   * Get a component by its id
   * @param id - ID of the component to get
   * @returns A component if it can be found
   */
  getComponentById(id: string): Component | undefined {
    return this.components[id];
  }

  /**
   * Get a component by its name
   * @param name - The name of the component
   * @returns A component if it can be found
   */
  getComponentByName(name: string): Component | undefined {
    return Object.values(this.components).find((component) => component.name === name);
  }

  // TODO: Use generics here
  getComponentByType(type: any): any | undefined {
    let comp = this.dataComponents.find((comp) => comp instanceof type);

    if (!comp) {
      comp = this.actionComponents.find((comp) => comp instanceof type);
    }

    return comp;
  }

  addChild(child: Entity): void {
    const hasChild = this.children.some((a) => a.id === child.id);
    if (hasChild) {
      return;
    }

    if (child.parent) {
      child.parent.removeChild(child);
    }

    this.children.push(child);
    child.parent = this;

    // Might need to update the world matrix to propagate to children
    const transform = this.getComponentByType(TransformComponent);
    const childTransform = child.getComponentByType(TransformComponent);
    if (transform && childTransform) {
      childTransform.updateWorldMatrix(transform.worldMatrix);
    }
  }

  removeChild(child: Entity): void {
    const hasChild = this.children.some((a) => a.id === child.id);
    if (!hasChild) {
      return;
    }

    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    child.parent = undefined;

    const transform = child.getComponentByType(TransformComponent);
    if (transform) {
      transform.updateLocalMatrix();
    }
  }

  preUpdate(dt: number): void {
    this.actionComponents.forEach((comp) => comp.preUpdate && comp.preUpdate(dt));
    this.children.forEach((child) => child.preUpdate(dt));
  }

  update(dt: number): void {
    this.actionComponents.forEach((comp) => comp.update && comp.update(dt));
    this.children.forEach((child) => child.update(dt));
  }

  postUpdate(dt: number): void {
    this.actionComponents.forEach((comp) => comp.postUpdate && comp.postUpdate(dt));
    this.children.forEach((child) => child.postUpdate(dt));
  }

  preRender(dt: number): void {
    this.actionComponents.forEach((comp) => comp.preRender && comp.preRender(dt));
    this.children.forEach((child) => child.preRender(dt));
  }

  render(dt: number): void {
    this.actionComponents.forEach((comp) => comp.render && comp.render(dt));
    this.children.forEach((child) => child.render(dt));
  }

  postRender(dt: number): void {
    this.actionComponents.forEach((comp) => comp.postRender && comp.postRender(dt));
    this.children.forEach((child) => child.postRender(dt));
  }
}