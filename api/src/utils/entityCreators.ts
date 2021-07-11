import { Entity } from '../ddd/Entity';
import { Blank, Question } from '../domain/models/Question';

const creatorsFactory = <E extends Entity, Props>(createEntity: (index: number) => E) => {
  const createOne = (overrides?: Partial<Props>, index = 0) => {
    return Object.assign(createEntity(index), { ...overrides });
  };

  const createMany = (count: number, overrides?: (index: number) => Partial<Props>) => {
    return Array(count)
      .fill(null)
      .map((_, n) => createOne(overrides?.(n), n));
  };

  return { createOne, createMany };
};

type QuestionProps = {
  text: string;
  blanks: Blank[];
};

const questionCreators = creatorsFactory<Question, QuestionProps>((index) => {
  return new Question(`question ${index + 1}`);
});

export const { createOne: createQuestion, createMany: createQuestions } = questionCreators;
