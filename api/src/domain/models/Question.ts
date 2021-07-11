import { Entity } from '../../ddd/Entity';
import { creatorsFactory } from '../../utils/entityCreators';

import { Blank } from './Blank';

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

type QuestionProps = {
  text: string;
  blanks: Blank[];
};

const questionCreators = creatorsFactory<Question, QuestionProps>((index) => {
  return new Question(`question ${index + 1}`);
});

export const { createOne: createQuestion, createMany: createQuestions } = questionCreators;
