import { configureStore } from '@reduxjs/toolkit';

import { Dependencies } from '../dependencies';
import { gameReducer } from '../slices/game.slice';
import { playerReducer } from '../slices/player.slice';
import { playersReducer } from '../slices/players.slice';

export const createStore = (deps: Dependencies) => {
  return configureStore({
    reducer: {
      player: playerReducer,
      game: gameReducer,
      players: playersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: deps,
        },
      }),
  });
};
