import React, {Component} from 'react';
import {fetch as fetchPlayer} from './services/player';
import {fetch as fetchGame} from './services/game';
import Login, {LogoutButton} from './components/pages/Login';
import Lobby from './components/pages/Lobby';
import Game from './components/pages/game/Game';
import {CircularProgress} from 'material-ui';
import ErrorSnackBar from './components/common/ErrorSnackbar';


class App extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      player: null,
      game: null,
      error: null,
    };

    this.reload();
  }

  reload() {
    fetchPlayer()
      .then(player => this.setPlayer(player));
  }

  setPlayer(player) {
    const nextState = {
      player,
      loading: false,
    };

    let promise = Promise.resolve();

    if (player && player.hasOwnProperty('game')) {
      promise = promise
        .then(fetchGame)
        .then(game => nextState.game = game);
    }

    promise.then(() => this.setState(nextState));
  }

  render() {
    const { loading, player, game, error } = this.state;

    if (loading)
      return <div className="loader"><CircularProgress size={80} thickness={2} /></div>;

    const setPlayer = player => this.setPlayer(player);
    const setGame = game => this.setState({ game });
    const setError = error => this.setState({ error });

    let content = null;

    if (!player)
      content = <Login onPlayerLogin={setPlayer} onError={setError} />;
    else if (!game)
      content = <Lobby player={player} setGame={setGame} onError={setError} />;
    else
      content = <Game player={player} game={game} reload={() => this.reload} onError={setError} />;

    const errorSnackBar = (
      <ErrorSnackBar error={error} onClose={() => setError(null)} />
    );

    const logoutButton = (
      <LogoutButton player={player} onLogout={() => setPlayer(null)} />
    );

    return (
      <div className="app">
        { player && logoutButton }
        { errorSnackBar }
        { content }
      </div>
    );
  }
}

export default App;
