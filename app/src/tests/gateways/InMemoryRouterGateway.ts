import { Game } from '../../domain/entities/Game';
import { RouterGateway } from '../../domain/gateways/RouterGateway';

export class InMemoryRouterGateway implements RouterGateway {
  history: string[] = ['/'];
  gameHistory: string[] = ['/'];

  get pathname() {
    return this.history[this.history.length - 1];
  }

  get gamePathname() {
    return this.gameHistory[this.gameHistory.length - 1];
  }

  push(to: string): void {
    this.history.push(to);
  }

  pushGame(game: Game, to: string): void {
    this.history.push(`/game/${game.code}`);
    this.gameHistory.push(`/game/${game.code}${to}`);
  }
}
