import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export interface RTCManager {
  isConnected(player: Player): boolean;
  join(game: Game, player: Player): void;
  leave(game: Game, player: Player): void;
}
