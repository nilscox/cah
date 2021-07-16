import { Game } from '../models/Game';
import { Player } from '../models/Player';

export class GameJoinedEvent {
  readonly type = 'GameJoined';
  constructor(public readonly game: Game, public readonly player: Player) {}
}
