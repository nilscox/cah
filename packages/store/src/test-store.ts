import { Game, GameEvent, GameState, Player } from '@cah/shared';
import { Action, Middleware } from 'redux';

import { MockClient } from './mock-client';
import { selectGame } from './slices/game/game.selectors';
import { selectPlayer } from './slices/player/player.selectors';
import { createStore } from './store/create-store';
import { AppSelector } from './types';
import { gameFetched } from './use-cases/fetch-game/fetch-game';
import { playerFetched } from './use-cases/fetch-player/fetch-player';

export class TestStore {
  public debug = false;

  private logActionMiddleware: Middleware = () => {
    return (next) => (action: Action<string>) => {
      if (this.debug) {
        console.log(action);
      }

      return next(action);
    };
  };

  public readonly client = new MockClient();
  public readonly store = createStore({ client: this.client }, [this.logActionMiddleware]);

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
    return this.select(selectPlayer);
  }

  setPlayer(player?: Partial<Player>) {
    this.dispatch(
      playerFetched({
        id: '',
        nick: '',
        ...player,
      }),
    );
  }

  getGame() {
    return this.select(selectGame);
  }

  setGame(game?: Partial<Game>) {
    this.dispatch(
      gameFetched({
        id: '',
        code: '',
        state: GameState.idle,
        players: [],
        ...game,
      }),
    );
  }
}
