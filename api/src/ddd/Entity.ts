import * as uuid from 'uuid';

export class Entity {
  constructor(public readonly id = uuid.v4()) {}

  equals(other?: Entity) {
    return Boolean(other && this.id === other.id);
  }
}
