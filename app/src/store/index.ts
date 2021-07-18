import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { playerReducer } from './reducers';
import { AppThunkMiddleware, Dependencies } from './types';

const rootReducer = combineReducers({
  player: playerReducer,
});

export const configureStore = (dependencies: Dependencies) => {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(dependencies) as AppThunkMiddleware)),
  );
};
