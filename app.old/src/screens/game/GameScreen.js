// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import selectors from '~/redux/selectors';
import MenuButton from '~/components/MenuButton';

import GameIdleView from './views/GameIdle';
import PlayersAnswerView from './views/PlayersAnswer';
import QuestionMasterSelectionView from './views/QuestionMasterSelection';
import EndOfTurnView from './views/EndOfTurn';

type GameState =
  | 'GAME_IDLE'
  | 'PLAYERS_ANSWER'
  | 'QM_SELECTION'
  | 'END_OF_TURN';

type GameProps = {
  gameState: GameState,
};

const mapStateToProps = (state) => ({
  gameState: selectors.gameState(state),
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
      case 'QM_SELECTION': return <QuestionMasterSelectionView />;
      case 'END_OF_TURN': return <EndOfTurnView />;
      default: throw new Error('Not implemented');
    }
  }
}

export default connect(mapStateToProps)(Game);
