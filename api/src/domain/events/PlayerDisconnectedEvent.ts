import { Game } from '../models/Game';
import { Player } from '../models/Player';

export class PlayerDisconnectedEvent {
  readonly type = 'PlayerDisconnected';
  constructor(public readonly game: Game, public readonly player: Player) {}
}
