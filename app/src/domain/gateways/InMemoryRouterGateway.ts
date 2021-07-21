import { RouterGateway } from '../../interfaces/gateways/RouterGateway';

export class InMemoryRouterGateway implements RouterGateway {
  history: string[] = [];

  get pathname() {
    return this.history[this.history.length - 1];
  }

  push(to: string): void {
    this.history.push(to);
  }
}
