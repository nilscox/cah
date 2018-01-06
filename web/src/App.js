import React from 'react';
import {connect} from 'react-redux';
import Login, {LogoutButton} from './components/pages/Login';
import Lobby from './components/pages/Lobby';
import Game from './components/pages/game/Game';
import {CircularProgress} from 'material-ui';
import ErrorSnackBar from './components/common/ErrorSnackbar';
import {clearError} from "./actions";

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearError()),
});

const App = ({ loading, player, game, error, clearError }) => {
  if (loading)
    return <div className="loader"><CircularProgress size={80} thickness={2} /></div>;

  const errorSnackBar = (
    <ErrorSnackBar error={error} onClose={clearError} />
  );

  const logoutButton = (
    <LogoutButton />
  );

  let content = null;

  if (!player || !player.nick)
    content = <Login />;
  else if (!game || !game.id)
    content = <Lobby />;
  else
    content = <Game />;

  return (
    <div className="app">
      { player && logoutButton }
      { errorSnackBar }
      { content }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
