import { createId } from 'src/utils/create-id';
import { factory } from 'src/utils/factory';

export type Player = {
  id: string;
  nick: string;
  gameId?: string;
};

export const createPlayer = factory<Player>(() => ({
  id: createId(),
  nick: '',
}));
