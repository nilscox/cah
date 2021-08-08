import { Choice } from './Choice';

export interface Player {
  id: string;
  nick: string;
  isConnected: boolean;
}

export interface FullPlayer extends Player {
  gameId?: string;
  cards: Choice[];
  hasFlushed: boolean;
}
