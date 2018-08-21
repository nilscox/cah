import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { fetchMe } from '../../services/player-service';
import { listGames } from '../../services/game-service';

const delay = ms => new Promise(r => setTimeout(r, ms));

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  text: {
    textAlign: 'center',
  },
});

export default class LoadingScreen extends React.Component {
  state = {
    loading: true,
    player: null,
  };

  async fetchGames() {
    const { res, json: games } = await listGames();

    if (res.status === 200)
      this.props.setGames(games);
  }

  async fetchPlayer() {
    const { res, json: player } = await fetchMe();

    if (res.status === 200) {
      this.props.setPlayer(player);
      this.setState({ player });
    }
  }

  async componentDidMount() {
    // the first request is not logged in the debugger without this
    await delay(0);

    await this.fetchGames();
    await this.fetchPlayer();

    // like a shit load of stuff are loading... lol
    await delay(4000);

    this.setState({ loading: false });
  }

  render() {
    const { loading, player } = this.state;

    if (!loading)
      return <Redirect to={ player ? '/lobby' : '/auth' } />;

    return (
      <View style={styles.view}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
}
