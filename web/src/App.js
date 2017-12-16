import React, {Component} from 'react';
import './App.css';
import request from './request';
import Login from './Login';
import Game from './Game';

class App extends Component {

  constructor() {
    super();

    this.state = {
      player: null
    };

    this.login();
  }

  login(nick) {
    let req = null;

    if (nick)
      req = request('POST', '/api/player/', { nick });
    else
      req = request('GET', '/api/player/');

    return req
      .then(player => {
        this.setState({
          player,
        });
      })
      .catch(err => console.error(err));
  }

  logout() {
    return request('DELETE', '/api/player/')
      .then(() => {
        this.setState({
          player: null,
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const player = this.state.player;

    return (
      <div className="app">
        <Login onSubmit={nick => this.login(nick)} onLogout={() => this.logout()} nick={player && player.nick} />
        <hr />
        <Game player={player} />
      </div>
    );
  }
}

export default App;
