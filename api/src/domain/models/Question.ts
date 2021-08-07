import { Entity } from '../../ddd/Entity';
import { InvalidNumberOfChoicesError } from '../errors/InvalidNumberOfChoicesError';

import { Blank } from './Blank';
import { Choice } from './Choice';

export class Question extends Entity {
  get text() {
    return this._text;
  }

  get blanks() {
    return this._blanks?.map(({ place }) => place);
  }

  constructor(private _text: string, private _blanks?: Blank[]) {
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

  override toString(choices?: Choice[]) {
    const { blanks, numberOfBlanks } = this;

    if (choices && choices.length !== numberOfBlanks) {
      throw new InvalidNumberOfChoicesError(numberOfBlanks, choices.length);
    }

    const getChoice = (index: number) => {
      return choices?.[index]?.text ?? '__';
    };

    if (!blanks) {
      return [this.text, getChoice(0)].join(' ');
    }

    let text = this.text;

    for (const [i, place] of Object.entries(blanks.reverse())) {
      text = [text.slice(0, place), text.slice(place)].join(getChoice(numberOfBlanks - Number(i) - 1));
    }

    return text;
  }

  toJSON() {
    return {
      text: this.text,
      blanks: this.blanks,
      numberOfBlanks: this.numberOfBlanks,
      formatted: this.toString(),
    };
  }
}

type QuestionProps = {
  text: string;
  blanks: Blank[];
};

export const createQuestion = ({ text, blanks }: Partial<QuestionProps> = {}) => {
  return new Question(text ?? 'question', blanks);
};

export const createQuestions = (count: number, overrides?: (index: number) => Partial<QuestionProps>) => {
  return Array(count)
    .fill(null)
    .map((_, n) => createQuestion(overrides?.(n) ?? { text: `question ${n}` }));
};
