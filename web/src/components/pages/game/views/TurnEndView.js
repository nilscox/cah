import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'material-ui';
import { nextTurn } from '../../../../actions/game';
import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';

const mapStateToProps = ({ player, game }) => ({
  turn: game.history[game.history.length - 1],
  canGoNext: game.question_master === player.nick,
});

const mapDispatchToProps = dispatch => ({
  nextTurn: () => dispatch(nextTurn()),
});

const TurnEndView = ({ turn, canGoNext, nextTurn }) => (
  <div className="turn-end-view">
    <div className="winner">{turn.winner} wins!</div>
    <div className="answers-list">
      {turn.answers.map(answer => (
        <div key={answer.id} className="answered-question">
          <AnsweredQuestionCard
            question={turn.question}
            answer={answer} />
          <div className="answered-by">{answer.answered_by}</div>
        </div>
      ))}
    </div>
    { canGoNext && <Button className="next-turn-btn" onClick={nextTurn}>Give my card to {turn.winner}</Button> }
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(TurnEndView);
