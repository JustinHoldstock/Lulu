import { generateUUID } from "../utils/random";

export class Asset {
  id: string = `asset-${generateUUID()}`;
}