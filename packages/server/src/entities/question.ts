import { createId } from 'src/utils/create-id';
import { factory } from 'src/utils/factory';

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
