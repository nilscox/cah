import { Middleware } from 'redux';
import { inspect } from 'util';

import { selectPlayer } from '../domain/selectors/playerSelectors';
import { createStore } from '../store/configureStore';
import { selectGame } from '../store/slices/game/game.selectors';
import { AppSelector, Dependencies } from '../store/types';

import { FakeNetworkGateway } from './gateways/FakeNetworkGateway';
import { FakeRTCGateway } from './gateways/FakeRTCGateway';
import { FakeServerGateway } from './gateways/FakeServerGateway';
import { FakeTimerGateway } from './gateways/FakeTimerGateway';
import { InMemoryPersistenceGateway } from './gateways/InMemoryPersistenceGateway';
import { InMemoryRouterGateway } from './gateways/InMemoryRouterGateway';
import { MockGameGateway } from './gateways/mock-game-gateway';
import { MockPlayerGateway } from './gateways/mock-player-gateway';

export class TestStore implements Dependencies {
  private logActions = false;

  private debugMiddleware: Middleware = () => (next) => (action) => {
    if (this.logActions) {
      console.log(inspect(action, false, null, true));
    }

    return next(action);
  };

  rtcGateway = new FakeRTCGateway();
  playerGateway = new MockPlayerGateway();
  gameGateway = new MockGameGateway();
  routerGateway = new InMemoryRouterGateway();
  timerGateway = new FakeTimerGateway();
  networkGateway = new FakeNetworkGateway();
  serverGateway = new FakeServerGateway();
  persistenceGateway = new InMemoryPersistenceGateway();

  private reduxStore = createStore(this, [this.debugMiddleware]);

  dispatch = this.reduxStore.dispatch.bind(this.reduxStore);
  getState = this.reduxStore.getState.bind(this.reduxStore);

  select<Result, Params extends unknown[]>(selector: AppSelector<Result, Params>, ...params: Params) {
    return selector(this.getState(), ...params);
  }

  logState() {
    console.dir(this.getState(), { colors: true, depth: null });
  }

  debug(enable = true) {
    this.logActions = enable;
  }

  get app() {
    return this.select((state) => state.app);
  }

  get player() {
    return this.select(selectPlayer);
  }

  get game() {
    return this.select(selectGame);
  }
}
