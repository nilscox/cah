import * as React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { listGames, joinGame } from 'Services/game-service';

import screen from 'Screens/screen.styles.js';
import Loading from 'Components/Loading';
import { ButtonPosition } from 'Components/Button';


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
    createGame: false,
  };

  async componentDidMount() {
    const { res, json } = await listGames();

    if (res.status === 200)
      this.setState({ games: json });
    else
      this.props.onError('listGames', json);
  }

  async joinGame(game) {
    const { history } = this.props;
    const { res, json } = await joinGame(game.id);

    if (res.status === 200)
      history.push(`/game/${json.id}`);
    else
      this.props.onError('joinGame', json);
  }

  render() {
    const { games } = this.state;

    if (!games)
      return <Loading />;

    return (
      <View style={[screen.view, screen.viewPadding]}>
        <Text style={screen.title}>Join a game</Text>
        <FlatList
          data={[...games, null]}
          keyExtractor={g => g ? '' + g.id : 'create'}
          renderItem={({ item }) => this.renderGameItem(item)}
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
    const { history } = this.props;

    return (
      <View style={styles.gameItem}>
        <Text>New game...</Text>
        <ButtonPosition
          primary
          position="end"
          title="create"
          size="small"
          onPress={() => history.push('/game/new')}
        />
      </View>
    );
  }

}
