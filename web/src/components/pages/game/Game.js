import React from 'react';
import {connect} from 'react-redux';
import QuestionView from './views/QuestionView';
import ChoicesView from './views/ChoicesView';
import './Game.css';
import GameIdle from './GameIdle';
import AnswerSelectionView from './views/AnswerSelectionView';

const STATE = {
  PLAYERS_ANSWER: 'PLAYERS_ANSWER',
  QUESTION_MASTER_SELECTION: 'QUESTION_MASTER_SELECTION',
};

const mapStateToProps = state => {
  const { game } = state;

  return {
    gameIsIdle: game.state === 'idle',
    playState: game.propositions && game.propositions.length === 0
      ? STATE.PLAYERS_ANSWER
      : STATE.QUESTION_MASTER_SELECTION,
  };
};

const Game = ({ gameIsIdle, playState }) => {
  if (gameIsIdle)
    return <GameIdle />;

  let mainView = null;

  if (playState === STATE.QUESTION_MASTER_SELECTION)
    mainView = <AnswerSelectionView />;
  else
    mainView = <QuestionView />;

  return (
    <div id="page-game" className="page">
      { mainView }
      <ChoicesView />
   </div>
  );
};

export default connect(mapStateToProps)(Game);
