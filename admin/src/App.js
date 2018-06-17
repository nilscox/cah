import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { middleware as packMiddleware } from 'redux-pack';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import Dashboard from './routes/Dashboard';
import Games from './routes/Games';
import Players from './routes/Players';

import apiMiddleware from './redux/middlewares/apiMiddleware';
import rootReducer from './redux/reducers';
import initialState from './redux/state';
import { initialization } from './redux/actions';

import Authentication from './routes/Authentication';

import './App.css';

const store = createStore(rootReducer, initialState,
  applyMiddleware(
    thunkMiddleware,
    promiseMiddleware,
    apiMiddleware,
    packMiddleware,
    loggerMiddleware,
  ),
);

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Authenticated = () => (
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
      <Route path="/games" component={Games} />
    </main>
  </div>
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>

        <Switch>
          <Route path="/login" component={Authentication} />
          <PrivateRoute path="/" component={Authenticated} />
        </Switch>

        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
