import { Game } from '../models/Game';
import { Player } from '../models/Player';

export class PlayerAnsweredEvent {
  readonly type = 'PlayerAnswered';
  constructor(public readonly game: Game, public readonly player: Player) {}
}
