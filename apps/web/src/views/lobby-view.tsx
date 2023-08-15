import { createGame, joinGame, selectHasGame, selectHasPlayer } from '@cah/store';
import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';

import { Header } from '../layout/header';
import { View } from '../layout/view';
import { store } from '../store';
import { selector } from '../utils/selector';
import { submitHandler } from '../utils/submit-handler';

export default function LobbyView() {
  const navigate = useNavigate();

  const hasPlayer = selector(selectHasPlayer);
  const hasGame = selector(selectHasGame);

  createEffect(() => {
    if (!hasPlayer()) {
      navigate('/auth');
    }
  });

  createEffect(() => {
    if (hasGame()) {
      navigate('/game');
    }
  });

  return (
    <View header={<Header>Create or join a game</Header>}>
      <CreateGame />
      <Or />
      <JoinGame />
    </View>
  );
}

function CreateGame() {
  return (
    <form
      onSubmit={submitHandler(() => void store.dispatch(createGame()))}
      class="col flex-1 items-center justify-center gap-6"
    >
      <button class="rounded border text-large">Create game</button>
      <p>
        Create a new game of Cards Against Humanity. You'll get a code to invite your friends to join your
        game.
      </p>
    </form>
  );
}

function Or() {
  return (
    <div class="row items-center gap-4 text-large">
      <div class="flex-1 border-t border-dashed" />
      OR
      <div class="flex-1 border-t border-dashed" />
    </div>
  );
}

function JoinGame() {
  return (
    <form
      onSubmit={submitHandler((data) => void store.dispatch(joinGame(data.get('code') as string)))}
      class="col flex-1 items-center justify-center gap-6"
    >
      <div class="row items-end gap-4">
        <input name="code" placeholder="Game code" autocomplete="off" />
        <button class="rounded border text-large">Join game</button>
      </div>
      <p>Enter a game code to join an existing game of Cards Against Humanity.</p>
    </form>
  );
}
