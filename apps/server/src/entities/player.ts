import { factory, createId } from '@cah/utils';

export type Player = {
  id: string;
  nick: string;
  gameId?: string;
};

export const createPlayer = factory<Player>(() => ({
  id: createId(),
  nick: '',
}));
