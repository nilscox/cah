import { configureStore } from '@reduxjs/toolkit';

import { Dependencies } from '../dependencies';
import { gameReducer } from '../slices/game/game.slice';
import { playerReducer } from '../slices/player/player.slice';
import { playersReducer } from '../slices/players/players.slice';
import { questionsReducer } from '../slices/questions/questions.slice';

export const createStore = (deps: Dependencies) => {
  return configureStore({
    reducer: {
      player: playerReducer,
      game: gameReducer,
      players: playersReducer,
      questions: questionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: deps,
        },
      }),
  });
};
