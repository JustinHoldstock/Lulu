import { Entity } from "../entities/entity";
import { generateUUID } from "../utils/random";

/**
 * Most basic form of component.
 * Try not to use it unless you want to make something custom!
 */
export class Component {
  // Randomized ID. Guaranteed unique.
  readonly id: string = `component-${generateUUID()}`;
  // Optional name that you can give components for an friendly lookup. Not guaranteed unique.
  name: string | undefined;

  entity: Entity | undefined;

  constructor() { }
}