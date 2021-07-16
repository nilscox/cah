import { Entity } from '../../ddd/Entity';

export class Choice extends Entity {
  get text() {
    return this._text;
  }

  constructor(private _text: string) {
    super();
  }
}
