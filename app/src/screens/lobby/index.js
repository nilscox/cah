import { createStackNavigator } from 'react-navigation';

import LobbyScreen from './LobbyScreen';
import ProfileScreen from '~/screens/profile';
import SettingsScreen from '~/screens/settings';

export default createStackNavigator({
  Lobby: { screen: LobbyScreen },
  Profile: { screen: ProfileScreen },
  Settings: { screen: SettingsScreen },
}, {
  initialRouteName: 'Lobby',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#4286f4',
    },
    headerTintColor: '#eee',
  },
});
