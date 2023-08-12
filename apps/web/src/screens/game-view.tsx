import { GameState } from '@cah/shared';
import { selectGame, selectGameUnsafe } from '@cah/store';
import { useNavigate } from '@solidjs/router';
import { Match, Show, Switch, createEffect } from 'solid-js';

import { selector } from '../selector';

import { GameFinishedView } from './game-finished-view';
import { GameIdleView } from './game-idle-view';
import { GameStartedView } from './game-started-view';

export default function GameView() {
  const navigate = useNavigate();

  const game = selector(selectGameUnsafe);

  createEffect(() => {
    if (!game()) {
      navigate('/');
    }
  });

  return (
    <Show when={game()}>
      <Game />
    </Show>
  );
}

function Game() {
  const game = selector(selectGame);

  return (
    <Switch>
      <Match when={game().state === GameState.idle}>
        <GameIdleView />
      </Match>

      <Match when={game().state === GameState.started}>
        <GameStartedView />
      </Match>

      <Match when={game().state === GameState.finished}>
        <GameFinishedView />
      </Match>
    </Switch>
  );
}
