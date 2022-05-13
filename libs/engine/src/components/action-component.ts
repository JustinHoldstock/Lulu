import { Component } from "./component";

/**
 * Optional component lifecycle methods to implement on instances.
 */
export interface ActionComponent {
  // Called once, ever, when the component is created
  onCreate?(): void;
  // Called once ever when the component is destroyed
  onDestroy?(): void;
  // Called every time a component is enabled
  onAwake?(): void;
  // Called every time a component is disabled
  onAsleep?(): void;

  // Happens for all components before update invoked
  preUpdate?(dt: number): void;
  // The update loop
  update?(dt: number): void;
  // Happens for all components after update invoked
  postUpdate?(dt: number): void;

  // Happens for all components before render invoked
  preRender?(dt: number): void;
  // The render loop
  render?(dt: number): void;
  // Happens for all components after render invoked
  postRender?(dt: number): void;
}

/**
 * A component that reacts to the component lifecycle events.
 * Needs to be inherited and implemented in other components.
 */
export abstract class ActionComponent extends Component {
  // If true, the component lifecycle will execute
  private _enabled: boolean = false;

  // Enable or disable a component
  // Also invokes awake/asleep, if implemented
  set enabled(enabled: boolean) {
    this._enabled = enabled;

    if (this._enabled && this.onAwake) {
      this.onAwake();
    } else if (this.onAsleep) {
      this.onAsleep();
    }
  }

  // Returns whether or not the component is enabled
  get enabled() {
    return this._enabled;
  }

  // Invoke to kill this component
  destroy(): void {
    this.name = undefined;
    if (this.onDestroy) {
      this.onDestroy();
    }
  }
}