import { createStackNavigator } from 'react-navigation';

import GameScreen from './GameScreen';
import GameInfoScreen from '~/screens/gameInfo';
import ProfileScreen from '~/screens/profile';
import SettingsScreen from '~/screens/settings';

export default createStackNavigator({
  Game: { screen: GameScreen },
  GameInfo: { screen: GameInfoScreen },
  Profile: { screen: ProfileScreen },
  Settings: { screen: SettingsScreen },
}, {
  initialRouteName: 'Game',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#4286f4',
    },
    headerTintColor: '#eee',
  },
});
