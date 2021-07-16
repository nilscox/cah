import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export interface Notifier {
  notifyPlayer<Message>(player: Player, message: Message): void;
  notifyGamePlayers<Message>(game: Game, message: Message): void;
}
