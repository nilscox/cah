import { Entity } from '../../ddd/Entity';
import { ValueObject } from '../../ddd/ValueObject';

export class Blank extends ValueObject<number> {
  get place() {
    return this.value;
  }
}

export class Question extends Entity {
  constructor(private text: string, private blanks?: Blank[]) {
    super();

    if (this.blanks?.length === 0) {
      throw new Error("A question's blanks can not be empty.");
    }
  }

  get numberOfBlanks() {
    if (!this.blanks) {
      return 1;
    }

    return this.blanks.length;
  }

  override toString() {
    if (!this.blanks) {
      return this.text + ' __';
    }

    let text = this.text;

    for (const { place } of this.blanks.reverse()) {
      text = [text.slice(0, place), text.slice(place)].join('__');
    }

    return text;
  }
}
