import { factory, createId } from '@cah/shared';

export type Turn = {
  id: string;
  gameId: string;
  questionMasterId: string;
  questionId: string;
  selectedAnswerId: string;
};

export const createTurn = factory<Turn>(() => ({
  id: createId(),
  gameId: '',
  questionMasterId: '',
  questionId: '',
  selectedAnswerId: '',
}));
