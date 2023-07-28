import { Player, Game, GameState } from '@cah/shared';

import { MockClient } from './mock-client';
import { gameActions, gameSelectors } from './slices/game.slice';
import { playerActions, playerSelectors } from './slices/player.slice';
import { createStore } from './store/create-store';
import { AppSelector } from './types';

export class TestStore {
  public readonly client = new MockClient();
  public readonly store = createStore({ client: this.client });

  getState = this.store.getState.bind(this.store);
  dispatch = this.store.dispatch.bind(this.store);

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
    this.dispatch(
      playerActions.setPlayer({
        id: 'playerId',
        nick: '',
        ...player,
      }),
    );
  }

  getGame() {
    return this.select(gameSelectors.game);
  }

  setGame(game?: Partial<Game>) {
    this.dispatch(
      gameActions.setGame({
        id: 'gameId',
        code: '',
        state: GameState.idle,
        players: [],
        ...game,
      }),
    );
  }
}
