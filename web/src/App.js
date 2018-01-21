import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui';

import { API_STATE } from './constants';
import { clearError } from './actions/error';

import Login, { LogoutButton } from './components/pages/Login';
import Lobby from './components/pages/Lobby';
import Game from './components/pages/game/Game';
import ErrorSnackBar from './components/common/ErrorSnackbar';

const mapStateToProps = state => {
  const { status, player, game } = state;

  if (status.api === API_STATE.DOWN)
    return { apiDown: true };

  if (status.appInitializing)
    return { loading: true };

  return {
    isLoggedIn: !!(player && player.nick),
    isInGame: !!(game && game.id),
  }
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearError()),
});

const App = ({ apiDown, loading, error, isLoggedIn, isInGame, clearError }) => {
  const page = (name, content) => (
    <div className="app">
      <div className="page" id={"page-" + name}>
        {content}
        <ErrorSnackBar error={error} onClose={clearError} />
      </div>
    </div>
  );

  if (apiDown)
    return page("api-down", <h4>API is down... Please wait, happy monkeys are fixing the problem.</h4>);

  if (loading)
    return page("loader", <CircularProgress size={80} thickness={2} />);

  if (!isLoggedIn)
    return page("login", <Login />);
  else if (!isInGame)
    return page("lobby", <Lobby />);

  return page("game", <Game />);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
