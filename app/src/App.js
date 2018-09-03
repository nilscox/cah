import * as React from 'react';
import { AppState, BackHandler, Alert, View, Text } from 'react-native';
import { NativeRouter, Switch, Route, Redirect, BackButton } from 'react-router-native';
import Toast from 'react-native-easy-toast';

import { fetchMe } from './services/player-service';
import { createWebSocket, emitter as websocket } from './services/websocket-service';

import AuthScreen from './screens/auth/AuthScreen';
import LobbyScreen from './screens/lobby/LobbyScreen';
import GameScreen from './screens/game/GameScreen';
import CreateGameScreen from './screens/game/CreateGameScreen';
import PlayerProfileScreen from './screens/player/PlayerProfileScreen';
import PlayerProfileEditScreen from './screens/player/PlayerProfileEditScreen';

import Loading from './components/Loading';


export default class App extends React.Component {

  state = {
    loading: true,
    player: null,
  };

  constructor(props) {
    super(props);

    this.socket = null;
    this.active = false;
    this.stateAfterResume = {};
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    AppState.addEventListener('change', this.handleAppStateChange);
    websocket.on('player:update', this.handlePlayerChange);
    websocket.on('player:cards', this.handlePlayerCards);

    this.init();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    AppState.removeEventListener('change', this.handleAppStateChange);
    websocket.off('player:update', this.handlePlayerChange);
    websocket.off('player:cards', this.handlePlayerCards);
  }

  setState(state, cb) {
    if (!this.active) {
      Object.assign(this.stateAfterResume, state);
      cb && cb();
    } else
      return super.setState(state, cb);
  }

  handleBackPress() {
    // TODO: press twice to quit
  }

  handleAppStateChange = (nextAppState) => {
    console.log('[APP]', 'state change', nextAppState);

    this.active = nextAppState === 'active';

    if (this.active) {
      if (Object.keys(this.stateAfterResume).length > 0) {
        this.setState(this.stateAfterResume);
        this.stateAfterResume = {};
      }
    }
  };

  handlePlayerChange = (p) => {
    const { player } = this.state;

    if (player && player.nick === p.nick)
      this.setState({ player: { ...player, ...p } });
  };

  handlePlayerCards = (cards) => {
    const { player } = this.state;

    this.setState({ player: { ...player, cards: [...player.cards, ...cards] } });
  };

  async init() {
    this.setState({ loading: true });

    await new Promise(r => setTimeout(r, 0));
    const { res, json } = await fetchMe();

    if (res.status === 200)
      this.setPlayer(json);
    else
      this.handleError('fetchMe', json);

    this.setState({ loading: false });
  }

  setPlayer(player, cb) {
    this.setState({ player }, () => {
      if (!this.socket)
        this.socket = createWebSocket();

      cb && cb();
    });
  }

  handleError(error, data) {
    console.log('[ERROR]', error, data);
  }

  // 7000ms seems like 1000ms... strange
  toast(message, duration = 7000) {
    this.refs.toast.show(message, duration);
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

    const common = {
      player,
      toast: this.toast.bind(this),
      setPlayer: this.setPlayer.bind(this),
      onError: this.handleError.bind(this),
    };

    return (
      <View style={{ flex: 1 }}>

        <NativeRouter>
          <BackButton>
            <Switch>
              <Route path="/" exact render={() => <Redirect to={getRouteAfterLoading()} />} />
              <Route path="/auth" render={(props) => <AuthScreen {...common} {...props} />} />
              <Route path="/lobby" render={(props) => <LobbyScreen {...common} {...props} />} />
              <Route path="/game/new" render={(props) => <CreateGameScreen {...common} {...props} />} />
              <Route path="/game/:id" render={(props) => <GameScreen {...common} {...props} />} />
              <Route path="/player" exact render={(props) => <PlayerProfileScreen {...common} {...props} />} />
              <Route path="/player/edit" render={(props) => <PlayerProfileEditScreen {...common} {...props} />} />
              <Route render={() => <Text>404.</Text>} />
            </Switch>
          </BackButton>
        </NativeRouter>

        <Toast
          style={{ backgroundColor: '#CCC', paddingHorizontal: 20, margin: 20 }}
          textStyle={{ color: '#333' }}
          opacity={0.7}
          ref="toast"
        />

      </View>
    );
  }

}
