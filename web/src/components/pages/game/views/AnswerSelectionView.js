import React from 'react';
import {connect} from 'react-redux';
import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';
import {selectAnswer} from '../../../../actions/game';

const mapStateToProps = state => {
  const { game, player } = state;

  return {
    question: game.question,
    answers: game.propositions,
    canSelectAnswer: game.question_master === player.nick,
  };
};

const mapDispatchToProps = dispatch => ({
  onSelectAnswer: answerId => dispatch(selectAnswer(answerId)),
});

const AnswerSelectionView = ({ question, answers, canSelectAnswer, onSelectAnswer }) => (
  <div className="answer-selection-view">
    <div className={'answers-list' + (canSelectAnswer ? ' can-select' : '')}>
      {answers.map(answer => (
        <AnsweredQuestionCard
          key={answer.id}
          question={question}
          answer={answer}
          onClick={() => canSelectAnswer ? onSelectAnswer(answer.id) : null} />
      ))}
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(AnswerSelectionView);
