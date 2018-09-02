import * as React from 'react';
import { AppState, Alert, Text } from 'react-native';
import { NativeRouter, Switch, Route, Redirect } from 'react-router-native';

import { fetchMe } from './services/player-service';
import { createWebSocket, emitter as websocket } from './services/websocket-service';

import AuthScreen from './screens/auth/AuthScreen';
import LobbyScreen from './screens/lobby/LobbyScreen';
import GameScreen from './screens/game/GameScreen';
import CreateGameScreen from './screens/game/CreateGameScreen';
import PlayerProfileScreen from './screens/player/PlayerProfileScreen';

import Loading from './components/Loading';


export default class App extends React.Component {

  state = {
    loading: true,
    player: null,
  };

  constructor(props) {
    super(props);

    this.socket = null;
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    websocket.on('player:update', this.handlePlayerChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
    websocket.off('player:update', this.handlePlayerChange);
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active')
      this.init();
    else {
      if (this.socket)
        this.socket.disconnect();
    }
  }

  handlePlayerChange = (p) => {
    const { player } = this.state;

    if (player && player.nick === p.nick)
      this.setState({ player: p });
  };

  async init() {
    this.setState({ loading: true });

    await new Promise(r => setTimeout(r, 0));
    const { res, json } = await fetchMe();

    if (res.status === 200)
      this.setPlayer(json);
    else
      console.log(json);

    this.setState({ loading: false });
  }

  setPlayer(player, cb) {
    this.setState({ player }, () => {
      this.socket = createWebSocket();
      console.log(cb);
      cb && cb();
    });
  }

  render() {
    const { loading, player } = this.state;
    const getRouteAfterLoading = () => {
      if (!player)
        return '/auth';

      if (!player.gameId)
        return '/lobby';
      else
        return '/game/' + player.gameId;
    }

    if (loading)
      return <Loading />;

    return (
      <NativeRouter>
        <Switch>
          <Route path="/" exact render={() => <Redirect to={getRouteAfterLoading()} />} />
          <Route path="/auth" render={(props) => <AuthScreen setPlayer={this.setPlayer.bind(this)} {...props} />} />
          <Route path="/lobby" component={LobbyScreen} />
          <Route path="/game/new" component={CreateGameScreen} />
          <Route path="/game/:id" render={props => <GameScreen player={player} {...props} />} />
          <Route path="/player/:nick" component={PlayerProfileScreen} />
          <Route render={() => <Text>404.</Text>} />
        </Switch>
      </NativeRouter>
    );
  }

}
