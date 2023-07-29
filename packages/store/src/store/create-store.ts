import { configureStore } from '@reduxjs/toolkit';

import { Dependencies } from '../dependencies';
import { choicesSlice } from '../slices/choices/choices.slice';
import { gameSlice } from '../slices/game/game.slice';
import { playerSlice } from '../slices/player/player.slice';
import { playersSlice } from '../slices/players/players.slice';
import { questionsSlice } from '../slices/questions/questions.slice';

export const createStore = (deps: Dependencies) => {
  return configureStore({
    reducer: {
      [playerSlice.name]: playerSlice.reducer,
      [gameSlice.name]: gameSlice.reducer,
      [playersSlice.name]: playersSlice.reducer,
      [questionsSlice.name]: questionsSlice.reducer,
      [choicesSlice.name]: choicesSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: deps,
        },
      }),
  });
};
