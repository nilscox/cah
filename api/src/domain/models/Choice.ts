import { Entity } from '../../ddd/Entity';

export class Choice extends Entity {
  get text() {
    return this._text;
  }

  constructor(private _text: string) {
    super();
  }
}

type ChoiceProps = {
  text: string;
};

export const createChoice = ({ text }: Partial<ChoiceProps> = {}) => {
  return new Choice(text ?? 'choice');
};

export const createChoices = (count: number, overrides?: (index: number) => Partial<ChoiceProps>) => {
  return Array(count)
    .fill(null)
    .map((_, n) => createChoice(overrides?.(n) ?? { text: `choice ${n}` }));
};
