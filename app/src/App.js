import * as React from 'react';
import { Alert, Text } from 'react-native';
import { NativeRouter, Switch, Route, Redirect } from 'react-router-native';

import { fetchMe } from './services/player-service';

import AuthScreen from './screens/auth/AuthScreen';
import LobbyScreen from './screens/lobby/LobbyScreen';
import GameScreen from './screens/game/GameScreen';

import Loading from './components/Loading';


export default class App extends React.Component {

  state = {
    loading: true,
    player: null,
  };

  async componentDidMount() {
    await new Promise(r => setTimeout(r, 0));

    const { res, json } = await fetchMe();

    if (res.status === 200)
      this.setState({ player: json });
    else
      console.log(json);

    this.setState({ loading: false });
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
          <Route path="/auth" render={() => <AuthScreen setPlayer={p => this.setState(p)} />} />
          <Route path="/lobby" component={LobbyScreen} />
          <Route path="/game/:id" component={GameScreen} />
          <Route render={() => <Text>404.</Text>} />
        </Switch>
      </NativeRouter>
    );
  }

}
