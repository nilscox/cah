import { leaveGame, selectAllPlayers, selectGameCode, startGame } from '@cah/store';
import { useNavigate } from '@solidjs/router';
import { For } from 'solid-js';

import { Header } from '../layout/header';
import { View } from '../layout/view';
import { selector } from '../selector';
import { store } from '../store';
import { submitHandler } from '../submit-handler';

export function GameIdleView() {
  const navigate = useNavigate();

  const code = selector(selectGameCode);
  const players = selector(selectAllPlayers);

  return (
    <View header={<Header>Get ready</Header>}>
      <p>
        Waiting for more players to join... You'll be able to start the game when there are at least 3
        players.
      </p>

      <p>Once the game has started, players won't be able to join or leave.</p>

      <div class="col gap-4 py-6">
        <p>Your game code is:</p>

        <div
          class="self-center rounded border bg-muted px-6 py-2 text-xl"
          onClick={() => void navigator.clipboard.writeText(code())}
        >
          {code()}
        </div>
      </div>

      <div>
        <p>Players:</p>
        <ul class="list-inside list-disc">
          <For each={players()}>{(player) => <li>{player.nick}</li>}</For>
        </ul>
      </div>

      <form
        onSubmit={submitHandler(() => void store.dispatch(startGame(3)))}
        class="mt-6 self-center text-large"
      >
        <button class="rounded border">Start</button>
      </form>

      <form
        onSubmit={submitHandler(() => void store.dispatch(leaveGame()).then(() => navigate('/')))}
        class="mt-6 self-center text-large"
      >
        <button>Leave</button>
      </form>
    </View>
  );
}
