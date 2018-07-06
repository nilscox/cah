import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { middleware as packMiddleware } from 'redux-pack';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Dashboard from './routes/Dashboard';
import Games from './routes/Games';
import Players from './routes/Players';
import Player from './routes/Player';
import GameDetails from './routes/GameDetails';

import apiMiddleware from './redux/middlewares/apiMiddleware';
import loggerMiddleware from './redux/middlewares/loggerMiddleware';
import rootReducer from './redux/reducers';
import { initialization } from './redux/actions';

import './App.css';

const store = createStore(rootReducer,
  applyMiddleware(
    thunkMiddleware,
    promiseMiddleware,
    apiMiddleware,
    packMiddleware,
    loggerMiddleware,
  ),
);

store.dispatch(initialization());

const App = ({ initializing }) => {
  if (initializing)
    return 'Loading...';

  return (
    <BrowserRouter>
      <div className="root">

        <nav>
          <h1>CAHdmin</h1>
          <Link to="/">Dashboard</Link>
          <Link to="/players">Players</Link>
          <Link to="/games">Games</Link>
        </nav>

        <main>
          <Route exact path="/" component={Dashboard} />
          <Route path="/players" component={Players} />
          <Route path="/player/2" component={Player} />
          <Route exact path="/games" component={Games} />
          <Route path="/games/:id" component={GameDetails} />
        </main>

      </div>
    </BrowserRouter>
  );
};

const ConnectedApp = connect((state) => ({
  initializing: state.status.initializing,
}))(App);

export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
