import { Notifier } from '../../application/interfaces/Notifier';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class StubNotifier implements Notifier {
  private playersMessages = new Map<Player, unknown[]>();

  playerMessages(player: Player) {
    return this.playersMessages.get(player) ?? [];
  }

  lastPlayerMessage(player: Player) {
    const messages = this.playerMessages(player);

    return messages[messages.length - 1];
  }

  notifyPlayer<Message>(player: Player, message: Message): void {
    this.playersMessages.set(player, [...this.playerMessages(player), message]);
  }

  private gamesMessages = new Map<Game, unknown[]>();

  gameMessages(game: Game) {
    return this.gamesMessages.get(game) ?? [];
  }

  lastGameMessage(game: Game) {
    const messages = this.gameMessages(game);

    return messages[messages.length - 1];
  }

  notifyGamePlayers<Message>(game: Game, message: Message): void {
    this.gamesMessages.set(game, [...this.gameMessages(game), message]);
  }
}
