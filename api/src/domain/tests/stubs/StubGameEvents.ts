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

  onPlayerEvent(player: Player, event: PlayerEvent): void {
    if (!this.playerEvents.has(player)) {
      this.playerEvents.set(player, []);
    }

    this.playerEvents.get(player)!.push(event);
  }

  onGameEvent(game: Game, event: GameEvent): void {
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
