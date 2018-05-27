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
        <Text>Game #{game.id}</Text>
      </View>
    );
  }
}

export default GameInfoScreen;
