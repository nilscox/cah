import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui';

import { API_STATE } from './constants';
import { clearError } from './actions/error';

import Login from './components/pages/Login';
import Lobby from './components/pages/Lobby';
import Game from './components/pages/game/Game';
import GameIdle from './components/pages/game/GameIdle';
import ErrorSnackBar from './components/common/ErrorSnackbar';

import './App.scss';

const mapStateToProps = state => {
  const { status, player, game, settings } = state;

  if (status.api === API_STATE.DOWN)
    return { apiDown: true, settings };

  if (status.appInitializing)
    return { loading: true, settings };

  return {
    isLoggedIn: !!(player && player.nick),
    isInGame: !!(game && game.id),
    gameState: game && game.state,
    settings,
  }
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearError()),
});

const App = ({ apiDown, loading, isLoggedIn, isInGame, gameState, settings, error, clearError }) => {
  let content = null;

  if (apiDown)
    content = <h4 className="api-down">API is down... Please wait, happy monkeys are fixing the problem.</h4>;
  else if (loading)
    content = <CircularProgress className="loader" size={80} thickness={2} />;
  else if (!isLoggedIn)
    content = <Login />;
  else if (!isInGame)
    content = <Lobby />;
  else if (gameState === 'idle')
    content = <GameIdle />;
  else if (gameState === 'started')
    content = <Game />;

  return (
    <div className={'app' + (settings.darkMode ? ' dark' : '')}>
      {content}
      <ErrorSnackBar error={error} onClose={clearError} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
