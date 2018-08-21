import * as React from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import { listGames, joinGame } from '../../services/game-service';

import Loading from '../../components/Loading';


const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
  },
  joinBtn: {
    marginLeft: 'auto',
  },
});

export default class LobbyScreen extends React.Component {

  state = {
    games: null,
    currentGame: null,
  };

  async componentDidMount() {
    const { res, json } = await listGames();

    if (res.status === 200)
      this.setState({ games: json })
    else
      console.log(json);
  }

  render() {
    const { games, currentGame } = this.state;

    if (!games)
      return <Loading />

    if (currentGame)
      return <Redirect to={`/game/${currentGame.id}`} />

    return (
      <View style={styles.view}>
        <Text>lobby</Text>
        <FlatList
          data={games}
          keyExtractor={g => "" + g.id}
          renderItem={({ item }) => this.renderGameItem(item)}
        />
      </View>
    );
  }

  renderGameItem(game) {
    return (
      <View style={styles.gameItem}>
        <Text>Game #{ game.id }</Text>
        <TouchableOpacity style={styles.joinBtn} onPress={() => this.joinGame(game)}>
          <Text>JOIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async joinGame(game) {
    const { res, json } = await joinGame(game.id);

    if (res.status === 200)
      this.setState({ currentGame: json });
    else
      console.log(json);
  }

}
