import { leaveGame, selectPlayers, selectScores, selectWinners } from '@cah/store';
import { For, Show } from 'solid-js';

import { Header } from '../layout/header';
import { View } from '../layout/view';
import { selector } from '../utils/selector';

export function GameFinishedView() {
  const winners = selector(selectWinners);
  const scores = selector(selectScores);
  const players = selector(selectPlayers);

  const handleLeave = () => {
    void store.dispatch(leaveGame());
  };

  return (
    <View class="col gap-4" header={<Header>Game finished</Header>}>
      <div class="text-dim">
        <Show when={winners().length >= 2} fallback={<>Winner:</>}>
          Winners:
        </Show>
      </div>

      <div class="py-4 text-center text-xl font-bold">
        {winners()
          .map((winner) => winner?.nick)
          .join(', ')}
      </div>

      <div class="text-dim">Scores:</div>

      <ul class="list-inside list-disc">
        <For each={Array.from(scores().entries())}>
          {([playerId, score]) => (
            <li>
              {players()[playerId]?.nick}: {score}
            </li>
          )}
        </For>
      </ul>

      <button class="btn self-center" onClick={handleLeave}>
        Leave
      </button>
    </View>
  );
}
