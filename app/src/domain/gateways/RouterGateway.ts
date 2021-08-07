import { Game } from '../entities/Game';

export interface RouterGateway {
  push(to: string): void;
  pushGame(game: Game, to: string, state?: Record<string, unknown>): void;
}
