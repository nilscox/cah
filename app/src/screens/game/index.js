import { createStackNavigator } from 'react-navigation';

import GameScreen from './GameScreen';

export default createStackNavigator({
  Game: { screen: GameScreen },
}, {
  initialRouteName: 'Game',
});
