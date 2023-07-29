import { Middleware, configureStore } from '@reduxjs/toolkit';

import { Dependencies } from '../dependencies';
import { answersSlice } from '../slices/answers/answers.slice';
import { choicesSlice } from '../slices/choices/choices.slice';
import { gameSlice } from '../slices/game/game.slice';
import { playerSlice } from '../slices/player/player.slice';
import { playersSlice } from '../slices/players/players.slice';
import { questionsSlice } from '../slices/questions/questions.slice';

export const createStore = (deps: Dependencies, middlewares: Middleware[] = []) => {
  return configureStore({
    reducer: {
      [playerSlice.name]: playerSlice.reducer,
      [gameSlice.name]: gameSlice.reducer,
      [playersSlice.name]: playersSlice.reducer,
      [questionsSlice.name]: questionsSlice.reducer,
      [choicesSlice.name]: choicesSlice.reducer,
      [answersSlice.name]: answersSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: deps,
        },
      }).concat(middlewares),
  });
};
