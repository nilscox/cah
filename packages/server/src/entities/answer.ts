import { createId } from 'src/utils/create-id';
import { factory } from 'src/utils/factory';

export type Answer = {
  id: string;
  gameId: string;
  playerId: string;
  questionId: string;
  place?: number;
};

export const createAnswer = factory<Answer>(() => ({
  id: createId(),
  gameId: '',
  playerId: '',
  questionId: '',
}));
