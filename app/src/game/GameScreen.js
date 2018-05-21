import { createStackNavigator } from 'react-navigation';

import Game from './Game';

export default createStackNavigator({
  Game: { screen: Game },
}, {
  initialRouteName: 'Game',
});