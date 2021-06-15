import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { GameEvent, GameEvents, PlayerEvent } from '../../interfaces/GameEvents';

export class StubGameEvents implements GameEvents {
  private playerEvents = new Map<number, PlayerEvent[]>();
  private gameEvents = new Map<number, GameEvent[]>();

  clear() {
    this.playerEvents.clear();
    this.gameEvents.clear();
  }

  onPlayerEvent(player: Player, event: PlayerEvent): void {
    if (!this.playerEvents.has(player.id)) {
      this.playerEvents.set(player.id, []);
    }

    this.playerEvents.get(player.id)!.push(event);
  }

  onGameEvent(game: Game, event: GameEvent): void {
    if (!this.gameEvents.has(game.id)) {
      this.gameEvents.set(game.id, []);
    }

    this.gameEvents.get(game.id)!.push(event);
  }

  getPlayerEvents(player: Player) {
    return this.playerEvents.get(player.id);
  }

  getGameEvents(game: Game) {
    return this.gameEvents.get(game.id);
  }
}
