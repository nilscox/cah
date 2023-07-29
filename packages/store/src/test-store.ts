import { Game, GameEvent, Player, StartedGame, createGame, createPlayer } from '@cah/shared';
import { Action, Middleware } from 'redux';

import { MockClient } from './mock-client';
import { gameSelectors } from './slices/game/game.selectors';
import { gameActions } from './slices/game/game.slice';
import { playerSelectors } from './slices/player/player.selectors';
import { playerActions } from './slices/player/player.slice';
import { createStore } from './store/create-store';
import { AppSelector } from './types';

export class TestStore {
  private static throwOnRejectionMiddleware: Middleware = () => {
    return (next) => (action: Action<string>) => {
      if (action.type.endsWith('/rejected')) {
        // eslint-disable-next-line
        throw Object.assign(new Error(), (action as any).error);
      }

      return next(action);
    };
  };

  public readonly client = new MockClient();
  public readonly store = createStore({ client: this.client }, [TestStore.throwOnRejectionMiddleware]);

  getState = this.store.getState.bind(this.store);
  dispatch = this.store.dispatch.bind(this.store);

  dispatchEvent(event: GameEvent) {
    return this.dispatch(event);
  }

  select = <Params extends unknown[], Result>(
    selector: AppSelector<Params, Result>,
    ...params: Params
  ): Result => {
    return selector(this.getState(), ...params);
  };

  logState() {
    console.dir(this.getState(), { depth: null });
  }

  getPlayer() {
    return this.select(playerSelectors.player);
  }

  setPlayer(player?: Partial<Player>) {
    this.dispatch(playerActions.setPlayer(createPlayer(player)));
  }

  getGame() {
    return this.select(gameSelectors.game);
  }

  setGame(game?: Partial<Game | StartedGame>) {
    this.dispatch(gameActions.setGame(createGame(game)));
  }
}
