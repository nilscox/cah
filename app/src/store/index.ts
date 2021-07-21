import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { rootReducer } from './reducers';
import { AppThunkMiddleware, Dependencies } from './types';

export const configureStore = (dependencies: Dependencies) => {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(dependencies) as AppThunkMiddleware)),
  );
};
