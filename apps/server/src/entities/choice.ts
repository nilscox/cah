import { factory, createId } from '@cah/utils';

export type Choice = {
  id: string;
  gameId: string;
  playerId?: string;
  answerId?: string;
  text: string;
  caseSensitive: boolean;
  place?: number;
};

export const createChoice = factory<Choice>(() => ({
  id: createId(),
  gameId: '',
  text: '',
  caseSensitive: false,
}));
