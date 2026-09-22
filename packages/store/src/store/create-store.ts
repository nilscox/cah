import { type Middleware, configureStore } from '@reduxjs/toolkit';

import { type Dependencies } from '../dependencies.ts';
import { answersSlice } from '../slices/answers/answers.slice.ts';
import { choicesSlice } from '../slices/choices/choices.slice.ts';
import { gameSlice } from '../slices/game/game.slice.ts';
import { playerSlice } from '../slices/player/player.slice.ts';
import { playersSlice } from '../slices/players/players.slice.ts';
import { questionsSlice } from '../slices/questions/questions.slice.ts';
import { turnsSlice } from '../slices/turns/turns.slice.ts';

export const createStore = (deps: Dependencies, middlewares: Middleware[] = []) => {
  return configureStore({
    reducer: {
      [playerSlice.name]: playerSlice.reducer,
      [gameSlice.name]: gameSlice.reducer,
      [playersSlice.name]: playersSlice.reducer,
      [questionsSlice.name]: questionsSlice.reducer,
      [choicesSlice.name]: choicesSlice.reducer,
      [answersSlice.name]: answersSlice.reducer,
      [turnsSlice.name]: turnsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: deps,
        },
      }).concat(middlewares),
  });
};
