import { authenticate, selectHasPlayer } from '@cah/store';
import { useNavigate } from '@solidjs/router';
import clsx from 'clsx';
import { Icon } from 'solid-heroicons';
import { check } from 'solid-heroicons/solid';
import { createEffect, createSignal } from 'solid-js';

import { View } from '../layout/view';
import { store } from '../store';
import { selector } from '../utils/selector';
import { submitHandler } from '../utils/submit-handler';

export default function AuthenticationView() {
  const navigate = useNavigate();

  const [nick, setNick] = createSignal('');
  const hasPlayer = selector(selectHasPlayer);

  createEffect(() => {
    if (hasPlayer()) {
      navigate('/');
    }
  });

  return (
    <View class="mx-auto w-full max-w-lg">
      <div class="col flex-1 justify-center text-xl">
        <div>Cards</div>
        <div>Against</div>
        <div>Humanity</div>
      </div>

      <div class="flex-2 col">
        <form
          class="row items-center gap-4"
          onSubmit={submitHandler((data) => void store.dispatch(authenticate(data.get('nick') as string)))}
        >
          <input
            name="nick"
            placeholder="Enter your nick..."
            spellcheck={false}
            autocomplete="off"
            class="flex-1 outline-none"
            value={nick()}
            onInput={(event) => setNick(event.target.value)}
          />
          <button type="submit" class="p-0">
            <Icon path={check} class={clsx('w-5 transition-opacity', nick() === '' && 'opacity-0')} />
          </button>
        </form>
      </div>
    </View>
  );
}
