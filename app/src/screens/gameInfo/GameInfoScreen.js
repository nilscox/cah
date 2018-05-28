import * as React from 'react';
import { View, Text } from 'react-native';

import MenuButton from '~/components/MenuButton';
import styles from './GameInfoScreen.styles';

class GameInfoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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
        { game.history && this.renderHistory(game.history) }

      </View>
    );
  }

  renderMainInfo(game) {
    return (
      <View style={styles.mainInfo}>
        <Text style={styles.mainInfoTitle}>Game #{game.id}</Text>
        <Text style={styles.mainInfoText}>Owner: {game.owner}</Text>
        <Text style={styles.mainInfoText}>Langue: {game.lang}</Text>
        <Text style={styles.mainInfoText}>State: {game.state}</Text>
      </View>
    );
  }

  renderPlayersList(players) {
    return (
      <View style={styles.playersList}>
        <Text style={styles.playersListTitle}>Players</Text>
        { players.map(p => <Text key={`player-${p.nick}`}>{p.nick}</Text>) }
      </View>
    );
  }

  renderGameHistory(history) {
    return (
      <View style={styles.gameHistory}>
        <Text style={styles.gameHistoryTitle}>History</Text>
        <Text>{JSON.stringify(history)}</Text>
      </View>
    );
  }
}

export default GameInfoScreen;
