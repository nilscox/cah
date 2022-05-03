import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';

import { rootReducer } from './reducers';
import { Dependencies } from './types';

export const createStore = (dependencies: Dependencies, middlewares: Array<Middleware> = []) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddlewares) =>
      getDefaultMiddlewares({
        thunk: {
          extraArgument: dependencies,
        },
      }).concat(middlewares),
  });
};
