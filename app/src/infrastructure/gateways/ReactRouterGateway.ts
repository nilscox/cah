import { History } from 'history';

import { Game } from '../../domain/entities/Game';
import { RouterGateway } from '../../domain/gateways/RouterGateway';

export class ReactRouterGateway implements RouterGateway {
  constructor(private readonly history: History, private readonly gameHistory: History) {}

  push(to: string): void {
    this.history.push(to);
  }

  pushGame(game: Game, to: string): void {
    this.history.push(`/game/${game.code}`);
    this.gameHistory.push(`/game/${game.code}${to}`);
  }
}
