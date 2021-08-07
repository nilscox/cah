import { Game } from '../models/Game';
import { Player } from '../models/Player';

export class GameLeftEvent {
  readonly type = 'GameLeft';
  constructor(public readonly game: Game, public readonly player: Player) {}
}
