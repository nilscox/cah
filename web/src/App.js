import React, {Component} from 'react';
import Login from './Login';
import './App.css';

const request = (method, route, body) => {
    const opts = {
      method: method,
      credentials: 'include',
    };

    if (body) {
      opts.body = JSON.stringify(body);
      opts.headers = { 'Content-Type': 'application/json' };
    }

    return fetch('http://localhost:8000' + route, opts)
      .then(res => {
        if (res.status !== 200)
          throw new Error([method, route, '->', res.status].join(' '))

        return res.json();
      });
};

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
    return request('DELETE', '/api/player')
      .then(() => {
        this.setState({
          player: null,
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const nick = this.state.player && this.state.player.nick;

    return (
      <div className="app">
        <Login onSubmit={nick => this.login(nick)} onLogout={() => this.logout()} nick={nick} />
      </div>
    );
  }
}

export default App;
