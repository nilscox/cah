import { factory } from 'src/utils/factory';

export type Choice = {
  id: string;
  gameId: string;
  text: string;
  caseSensitive: boolean;
};

export const createChoice = factory<Choice>(() => ({
  id: 'choiceId',
  gameId: '',
  text: '',
  caseSensitive: false,
}));
