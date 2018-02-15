import React from 'react';
import { connect } from 'react-redux';
import QuestionView from './views/QuestionView';
import ChoicesView from './views/ChoicesView';
import GameInfoView from './views/GameInfoView';
import GameIdle from './GameIdle';
import AnswerSelectionView from './views/AnswerSelectionView';
import TurnEndView from './views/TurnEndView';
import './Game.css';
import './Game.dark.css';

const mapStateToProps = state => {
  const { game } = state;

  return {
    gameIsIdle: game.state === 'idle',
    playState: game.play_state,
  };
};

const Game = ({ gameIsIdle, playState }) => {
  const mapPlayStateToView = {
    'players_answer': <QuestionView />,
    'question_master_selection': <AnswerSelectionView />,
    'end_of_turn': <TurnEndView />,
  };

  if (gameIsIdle)
    return <GameIdle />;

  return (
    <div className="game">
      { mapPlayStateToView[playState] }
      <GameInfoView />
      <ChoicesView />
   </div>
  );
};

export default connect(mapStateToProps)(Game);
