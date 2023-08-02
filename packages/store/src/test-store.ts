import { GameEvent, GameState } from '@cah/shared';
import { Action, Middleware } from 'redux';

import { MockClient } from './mock-client';
import { gameSelectors } from './slices/game/game.selectors';
import { GameSlice, gameActions } from './slices/game/game.slice';
import { playerSelectors } from './slices/player/player.selectors';
import { PlayerSlice, playerActions } from './slices/player/player.slice';
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

  setPlayer(player?: Partial<PlayerSlice>) {
    this.dispatch(
      playerActions.setPlayer({
        id: '',
        nick: '',
        selectedChoicesIds: [],
        ...player,
      }),
    );
  }

  getGame() {
    return this.select(gameSelectors.game);
  }

  setGame(game?: Partial<GameSlice>) {
    this.dispatch(
      gameActions.setGame({
        id: '',
        code: '',
        playersIds: [],
        state: GameState.idle,
        ...game,
      }),
    );
  }
}
