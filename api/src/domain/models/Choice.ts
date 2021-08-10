import { Entity } from '../../ddd/Entity';

export class Choice extends Entity {
  public available = true;

  constructor(readonly text: string, readonly caseSensitive: boolean) {
    super();
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      caseSensitive: this.caseSensitive,
    };
  }
}

type ChoiceProps = {
  text: string;
  caseSensitive: boolean;
  available: boolean;
};

export const createChoice = (text = 'choice', { caseSensitive = false, available }: Partial<ChoiceProps> = {}) => {
  const choice = new Choice(text, caseSensitive);

  if (available !== undefined) {
    choice.available = available;
  }

  return choice;
};

export const createChoices = (count: number, overrides?: (index: number) => Partial<ChoiceProps>) => {
  return Array(count)
    .fill(null)
    .map((_, n) => createChoice(`choice ${n}`, overrides?.(n)));
};
