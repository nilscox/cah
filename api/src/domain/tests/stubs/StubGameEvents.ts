import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { GameEvent, GameEvents, PlayerEvent } from '../../interfaces/GameEvents';

export class StubGameEvents implements GameEvents {
  private playerEvents = new Map<Player, PlayerEvent[]>();
  private gameEvents = new Map<Game, GameEvent[]>();

  clear() {
    this.playerEvents.clear();
    this.gameEvents.clear();
  }

  emit(_game: Game, to: Player, event: PlayerEvent): void {
    if (!this.playerEvents.has(to)) {
      this.playerEvents.set(to, []);
    }

    this.playerEvents.get(to)!.push(event);
  }

  broadcast(game: Game, event: GameEvent): void {
    if (!this.gameEvents.has(game)) {
      this.gameEvents.set(game, []);
    }

    this.gameEvents.get(game)!.push(event);
  }

  getPlayerEvents(player: Player) {
    return this.playerEvents.get(player);
  }

  getGameEvents(game: Game) {
    return this.gameEvents.get(game);
  }
}
