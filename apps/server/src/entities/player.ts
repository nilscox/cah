import { factory, createId } from '@cah/shared';

export type Player = {
  id: string;
  nick: string;
  gameId?: string;
};

export const createPlayer = factory<Player>(() => ({
  id: createId(),
  nick: '',
}));
