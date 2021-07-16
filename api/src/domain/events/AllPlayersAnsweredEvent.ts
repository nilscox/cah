import { Game } from '../models/Game';

export class AllPlayersAnsweredEvent {
  readonly type = 'AllPlayersAnswered';
  constructor(public readonly game: Game) {}
}
