// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { State } from 'Types/state';
import QuestionView from './views/QuestionView';
import PlayerCardsView from './views/PlayerCardsView';
import GameInfoView from './views/gameinfo/GameInfoView';
import AnswerSelectionView from './views/AnswerSelectionView';
import TurnEndView from './views/TurnEndView';

type GameStateProps = {|
  playState: string,
|};

type GameProps = GameStateProps;

const mapStateToProps: State => GameStateProps = ({ game }) => ({
  playState: game.play_state,
});

const Game = ({ playState }: GameProps) => {
  const mapPlayStateToView = {
    'players_answer': <QuestionView />,
    'question_master_selection': <AnswerSelectionView />,
    'end_of_turn': <TurnEndView />,
  };

  return (
    <div className="page" id="page-game">

      <div className="game-state">
        { mapPlayStateToView[playState] }
        <GameInfoView />
      </div>

      <PlayerCardsView />

   </div>
  );
};

export default connect(mapStateToProps)(Game);
