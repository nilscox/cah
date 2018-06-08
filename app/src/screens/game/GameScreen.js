// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import MenuButton from '~/components/MenuButton';

import GameIdleView from './views/GameIdle';
import PlayersAnswerView from './views/PlayersAnswer';

type GameState =
  | 'GAME_IDLE'
  | 'PLAYERS_ANSWER'
  | 'QM_SELECTION'
  | 'END_OF_TURN';

type GameProps = {
  gameState: GameState,
};

const mapStateToProps = ({ game }) => ({
  gameState: (() => {
    if (game.state === 'idle')
      return 'GAME_IDLE';

    if (game.play_state === 'players_answer')
      return 'PLAYERS_ANSWER';

    if (game.play_state === 'question_master_selection')
      return 'QM_SELECTION';

    if (game.playe_state === 'end_of_turn')
      return 'END_OF_TURN';
  })(),
});

class Game extends React.Component<GameProps> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CAH',
      headerRight: (
        <MenuButton
          navigation={navigation}
          displayOptions={{
            Game: {
              route: 'GameInfo',
              args: { game: navigation.getParam('game') },
            },
            Profile: { route: 'Profile' },
            Settings: { route: 'Settings' },
          }}
        />
      ),
    };
  };

  render() {
    const { gameState } = this.props;

    switch (gameState) {
      case 'GAME_IDLE': return <GameIdleView />;
      case 'PLAYERS_ANSWER': return <PlayersAnswerView />;
      default: throw new Error('Not implemented');
    }
  }
}

export default connect(mapStateToProps)(Game);
