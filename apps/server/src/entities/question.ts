import { factory, createId } from '@cah/utils';

export type Question = {
  id: string;
  gameId: string;
  text: string;
  blanks?: number[];
};

export const createQuestion = factory<Question>(() => ({
  id: createId(),
  gameId: '',
  text: '',
}));
