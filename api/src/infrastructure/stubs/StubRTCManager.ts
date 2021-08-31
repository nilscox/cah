import { RTCManager } from '../../application/interfaces/RTCManager';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class StubRTCManager implements RTCManager {
  private games = new Map<string, Player[]>();
  private connectedPlayers = new Set<string>();

  private get(game: Game) {
    return this.games.get(game.code) ?? [];
  }

  setConnected(player: Player) {
    this.connectedPlayers.add(player.id);
  }

  isConnected(player: Player) {
    return this.connectedPlayers.has(player.id);
  }

  has(game: Game, player: Player) {
    return this.get(game).some((p) => p.equals(player));
  }

  join(game: Game, player: Player): void {
    this.games.set(game.code, [...this.get(game), player]);
  }

  leave(game: Game, player: Player): void {
    this.games.set(game.code, [...this.get(game).filter((p) => !p.equals(player))]);
  }
}
