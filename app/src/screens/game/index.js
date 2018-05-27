import { createStackNavigator } from 'react-navigation';

import GameScreen from './GameScreen';
import GameInfoScreen from '~/screens/GameInfoScreen';

export default createStackNavigator({
  Game: { screen: GameScreen },
  GameInfo: { screen: GameInfoScreen },
}, {
  initialRouteName: 'Game',
});
