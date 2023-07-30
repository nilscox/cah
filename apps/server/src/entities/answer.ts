import { factory, createId } from '@cah/shared';

export type Answer = {
  id: string;
  gameId: string;
  playerId: string;
  questionId: string;
  turnId?: string;
  place?: number;
};

export const createAnswer = factory<Answer>(() => ({
  id: createId(),
  gameId: '',
  playerId: '',
  questionId: '',
}));
