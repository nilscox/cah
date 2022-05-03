import { Choice } from './Choice';

export type Player = {
  id: string;
  nick: string;
  isConnected: boolean;
  game: PlayerGame | null;
};

export type InGamePlayer = Omit<Player, 'game'> & {
  game: PlayerGame;
};

export type PlayerGame = {
  gameId: string;
  cards: Record<string, Choice>;
  selection: Array<string | null>;
  selectionValidated: boolean;
  hasFlushed: boolean;
};
