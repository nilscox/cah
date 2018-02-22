// @flow

import React from 'react';
import { connect } from 'react-redux';

import QuestionView from './views/QuestionView';
import PlayerCardsView from './views/PlayerCardsView';
import GameInfoView from './views/gameinfo/GameInfoView';
import AnswerSelectionView from './views/AnswerSelectionView';
import TurnEndView from './views/TurnEndView';

const mapStateToProps = state => {
  const { game } = state;

  return {
    playState: game.play_state,
  };
};

type GameProps = {
  playState: string,
};

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
