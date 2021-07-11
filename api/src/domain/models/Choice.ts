import { Entity } from '../../ddd/Entity';

export class Choice extends Entity {
  constructor(private text: string) {
    super();
  }
}
