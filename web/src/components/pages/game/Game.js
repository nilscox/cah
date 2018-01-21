import React from 'react';
import { connect } from 'react-redux';
import QuestionView from './views/QuestionView';
import ChoicesView from './views/ChoicesView';
import GameInfoView from './views/GameInfoView';
import GameIdle from './GameIdle';
import AnswerSelectionView from './views/AnswerSelectionView';
import './Game.css';

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
      <GameInfoView />
      <ChoicesView />
   </div>
  );
};

export default connect(mapStateToProps)(Game);
