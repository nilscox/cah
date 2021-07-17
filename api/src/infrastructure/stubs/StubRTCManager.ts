import { RTCManager } from '../../application/interfaces/RTCManager';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class StubRTCManager implements RTCManager {
  private games = new Map<Game, Player[]>();

  private get(game: Game) {
    return this.games.get(game) ?? [];
  }

  isConnected(player: Player) {
    return false;
  }

  has(game: Game, player: Player) {
    return this.get(game).some((p) => p.equals(player));
  }

  join(game: Game, player: Player): void {
    this.games.set(game, [...this.get(game), player]);
  }

  leave(game: Game, player: Player): void {
    this.games.set(game, [...this.get(game).filter((p) => !p.equals(player))]);
  }
}
