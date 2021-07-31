import { Entity } from '../../ddd/Entity';

export class Choice extends Entity {
  public available = true;

  get text() {
    return this._text;
  }

  constructor(private _text: string) {
    super();
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
    };
  }
}

type ChoiceProps = {
  text: string;
  available: boolean;
};

export const createChoice = ({ text, available }: Partial<ChoiceProps> = {}) => {
  const choice = new Choice(text ?? 'choice');

  if (available !== undefined) {
    choice.available = available;
  }

  return choice;
};

export const createChoices = (count: number, overrides?: (index: number) => Partial<ChoiceProps>) => {
  return Array(count)
    .fill(null)
    .map((_, n) => createChoice(overrides?.(n) ?? { text: `choice ${n}` }));
};
