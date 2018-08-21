import * as React from 'react';
import { Text } from 'react-native';
import { NativeRouter, Switch, Route, Redirect } from 'react-router-native';

import LoadingScreen from './screens/loading/LoadingScreen';
import AuthScreen from './screens/auth/AuthScreen';
import LobbyScreen from './screens/lobby/LobbyScreen';

export default class App extends React.Component {

  setGames(games) {
    this.setState({ games });
  }

  setPlayer(player) {
    this.setState({ player });
  }

  render() {
    return (
      <NativeRouter>
        <Switch>

          <Route path="/" exact render={() => <Redirect to="/loading" />} />

          <Route path="/loading" render={() => (
            <LoadingScreen
              setGames={this.setGames.bind(this)}
              setPlayer={this.setPlayer.bind(this)}
            />
          )} />

          <Route path="/auth" component={AuthScreen} />

          <Route path="/lobby" component={LobbyScreen} />

          <Route render={() => <Text>404.</Text>} />

        </Switch>
      </NativeRouter>
    );
  }
}
