import { initialize } from '@cah/store';
import { Route, Routes } from '@solidjs/router';
import { Show, createEffect, createSignal, lazy, onMount } from 'solid-js';

import { View } from './layout/view';
import { store } from './store';

const AuthenticationView = lazy(() => import('./screens/authentication-view'));
const LobbyView = lazy(() => import('./screens/lobby-view'));
const GameView = lazy(() => import('./screens/game-view'));

export function App() {
  const [initialized, setInitialized] = createSignal(false);

  onMount(() => void store.dispatch(initialize()).then(() => setInitialized(true)));

  return (
    <Show when={initialized()} fallback={<Loading />}>
      <Routes>
        <Route path="/auth" component={AuthenticationView} />
        <Route path="/" component={LobbyView} />
        <Route path="/game" component={GameView} />
      </Routes>
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
