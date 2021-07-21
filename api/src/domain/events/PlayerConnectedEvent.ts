import { Game } from '../models/Game';
import { Player } from '../models/Player';

export class PlayerConnectedEvent {
  readonly type = 'PlayerConnected';
  constructor(public readonly game: Game, public readonly player: Player) {}
}
