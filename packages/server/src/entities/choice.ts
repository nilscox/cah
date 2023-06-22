import { createId } from 'src/utils/create-id';
import { factory } from 'src/utils/factory';

export type Choice = {
  id: string;
  gameId: string;
  playerId?: string;
  text: string;
  caseSensitive: boolean;
};

export const createChoice = factory<Choice>(() => ({
  id: createId(),
  gameId: '',
  text: '',
  caseSensitive: false,
}));
