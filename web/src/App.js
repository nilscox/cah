import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui';

import { API_STATE } from './constants';
import { clearError } from './actions/error';

import Login, { LogoutButton } from './components/pages/Login';
import Lobby from './components/pages/Lobby';
import Game from './components/pages/game/Game';
import ErrorSnackBar from './components/common/ErrorSnackbar';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearError()),
});

const App = ({ player, game, error, status, clearError }) => {
  if (status.api === API_STATE.DOWN)
    return <h4 className="api-down">API is down... Please wait, happy monkeys are fixing the problem.</h4>;

  if (status.appInitializing)
    return <div className="loader"><CircularProgress size={80} thickness={2} /></div>;

  const isLoggedIn = !!(player && player.nick);
  const isInGame = !!(game && game.id);

  const errorSnackBar = (
    <ErrorSnackBar error={error} onClose={clearError} />
  );

  const logoutButton = (
    <LogoutButton />
  );

  let content = null;

  if (!isLoggedIn)
    content = <Login />;
  else if (!isInGame)
    content = <Lobby />;
  else
    content = <Game />;

  return (
    <div className="app">
      { isLoggedIn && logoutButton }
      { errorSnackBar }
      { content }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
