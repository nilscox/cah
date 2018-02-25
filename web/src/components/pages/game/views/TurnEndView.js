// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'material-ui';

import type { Dispatch, Action } from '../../../../types/actions';
import type { State } from '../../../../types/state';
import type { GameTurnType, GameType } from '../../../../types/models';
import { nextTurn } from '../../../../actions/game';
import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';

type TurnEndViewStateProps = {|
  turn: GameTurnType,
  canGoNext: boolean,
|};

type TurnEndViewDispatchProps = {|
  nextTurn: () => Action,
|};

type TurnEndViewProps =
  & TurnEndViewStateProps
  & TurnEndViewDispatchProps;

const mapStateToProps: State => TurnEndViewStateProps = ({
  player,
  game,
  gameHistory
}) => ({
  turn: gameHistory[gameHistory.length - 1],
  canGoNext: game.question_master === player.nick,
});

const mapDispatchToProps: Dispatch => TurnEndViewDispatchProps = dispatch => ({
  nextTurn: () => dispatch(nextTurn()),
});

const TurnEndView = ({ turn, canGoNext, nextTurn }: TurnEndViewProps) => (
  <div className="game-view" id="turn-end">

    <div className="winner">{turn.winner} wins!</div>

    <div className="answers-list">

      {turn.answers.map(answer => (
        <div key={answer.id} className="answered-question">

          <AnsweredQuestionCard
            question={turn.question}
            answer={answer.answers}
          />

          <div className="answered-by">{answer.answered_by}</div>

        </div>
      ))}

    </div>

    { canGoNext && <Button className="next-turn-btn" onClick={nextTurn}>Give my card to {turn.winner}</Button> }

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(TurnEndView);
