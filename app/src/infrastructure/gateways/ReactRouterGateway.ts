import { History } from 'history';

import { RouterGateway } from '../../domain/gateways/RouterGateway';

export class ReactRouterGateway implements RouterGateway {
  constructor(private readonly history: History) {}

  get pathname() {
    return this.history.location.pathname;
  }

  push(to: string): void {
    this.history.push(to);
  }
}
