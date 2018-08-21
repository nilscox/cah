// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Navigation, NavigationProps } from '~/types/navigation';
import type { Game, GameHistory } from '~/redux/state/game';
import type { Player } from '~/redux/state/player';
import MenuButton from '~/components/MenuButton';
import styles from './GameInfoScreen.styles';

type GameInfoScreenProps = NavigationProps;
type NavigationOptions = { navigation: Navigation };

class GameInfoScreen extends React.Component<GameInfoScreenProps> {
  static navigationOptions = ({ navigation }: NavigationOptions) => ({
    title: 'Game Info',
    headerStyle: {
      backgroundColor: '#4286f4',
    },
    headerTintColor: '#eee',
    headerRight: (
      <MenuButton
        navigation={navigation}
        displayOptions={{ Profile: 'Profile', Settings: 'Settings' }}
      />
    ),
  });

  render() {
    const { navigation } = this.props;
    const game = navigation.getParam('game');

    return (
      <View style={styles.wrapper}>

        { this.renderMainInfo(game) }
        { this.renderPlayersList(game.players) }
        { game.history && this.renderGameHistory(game.history) }

      </View>
    );
  }

  renderMainInfo(game: Game) {
    return (
      <View style={styles.mainInfo}>
        <Text style={styles.mainInfoTitle}>Game #{game.id}</Text>
        <Text style={styles.mainInfoText}>Owner: {game.owner}</Text>
        <Text style={styles.mainInfoText}>Langue: {game.lang}</Text>
        <Text style={styles.mainInfoText}>State: {game.state}</Text>
      </View>
    );
  }

  renderPlayersList(players: Array<Player>) {
    return (
      <View style={styles.playersList}>
        <Text style={styles.playersListTitle}>Players</Text>
        { players.map(p => <Text key={`player-${p.nick}`}>{p.nick}</Text>) }
      </View>
    );
  }

  renderGameHistory(history: GameHistory) {
    return (
      <View style={styles.gameHistory}>
        <Text style={styles.gameHistoryTitle}>History</Text>
        <Text>{JSON.stringify(history)}</Text>
      </View>
    );
  }
}

export default GameInfoScreen;
