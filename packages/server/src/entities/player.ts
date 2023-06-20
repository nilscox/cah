import { Choice } from './choice';

export type Player = {
  id: string;
  nick: string;
  gameId?: string;
  cards?: Choice[];
};
