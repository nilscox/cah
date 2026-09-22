import { initialize } from '@cah/store';
import { Route } from '@solidjs/router';
import { Show, createEffect, createSignal, lazy, onMount } from 'solid-js';

import { View } from './layout/view.tsx';
import { store } from './store.ts';

const AuthenticationView = lazy(() => import('./views/authentication-view.tsx'));
const LobbyView = lazy(() => import('./views/lobby-view.tsx'));
const GameView = lazy(() => import('./views/game-view.tsx'));

export function App() {
  const [initialized, setInitialized] = createSignal(false);

  onMount(() => void store.dispatch(initialize()).then(() => setInitialized(true)));

  return (
    <Show when={initialized()} fallback={<Loading />}>
      <Route path="/auth" component={AuthenticationView} />
      <Route path="/" component={LobbyView} />
      <Route path="/game" component={GameView} />
    </Show>
  );
}

function Loading() {
  const [showLoader, setShowLoader] = createSignal(false);

  createEffect(() => {
    setTimeout(() => setShowLoader(true), 200);
  });

  return (
    <Show when={showLoader()}>
      <View class="items-center justify-center">Loading...</View>
    </Show>
  );
}
