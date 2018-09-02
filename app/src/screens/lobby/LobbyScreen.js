import * as React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Redirect } from 'react-router-native';

import { listGames, joinGame, createGame } from '../../services/game-service';

import screen from '../screen.styles.js';
import Loading from '../../components/Loading';
import Button, { ButtonPosition } from '../../components/Button';
import CreateGameModal from './CreateGameModal';


const styles = StyleSheet.create({
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
  },
});

export default class LobbyScreen extends React.Component {

  state = {
    games: null,
    currentGame: null,
    createGameModal: false,
  };

  async componentDidMount() {
    const { res, json } = await listGames();

    if (res.status === 200)
      this.setState({ games: json })
    else
      console.log(json);
  }

  async joinGame(game) {
    const { res, json } = await joinGame(game.id);

    if (res.status === 200)
      this.setState({ currentGame: json });
    else
      console.log(json);
  }

  async createGame(lang, nbQuestions, cardsPerPlayer) {
    const { res, json } = await createGame(lang, nbQuestions, cardsPerPlayer);

    if (res.status === 201)
      this.setState({ currentGame: json, createGameModal: false });
    else
      console.log(json);
  }

  render() {
    const { games, currentGame, createGameModal } = this.state;

    if (!games)
      return <Loading />

    if (currentGame)
      return <Redirect to={`/game/${currentGame.id}`} />

    return (
      <View style={[screen.view, screen.viewPadding]}>
        <Text style={screen.title}>Join a game</Text>
        <FlatList
          data={[...games, null]}
          keyExtractor={g => g ? '' + g.id : 'create'}
          renderItem={({ item }) => this.renderGameItem(item)}
        />
        <CreateGameModal
          visible={createGameModal}
          createGame={this.createGame.bind(this)}
          cancel={() => this.setState({ createGameModal: false })}
        />
      </View>
    );
  }

  renderGameItem(game) {
    if (!game)
      return this.renderCreateGameItem();

    return (
      <View style={styles.gameItem}>
        <Text>Game #{ game.id }</Text>
        <ButtonPosition
          primary
          position="end"
          title="join"
          size="small"
          onPress={() => this.joinGame(game)}
        />
      </View>
    );
  }

  renderCreateGameItem() {
    return (
      <View style={styles.gameItem}>
        <Text>New game...</Text>
        <ButtonPosition
          primary
          position="end"
          title="create"
          size="small"
          onPress={() => this.setState({ createGameModal: true })}
        />
      </View>
    );
  }

}
