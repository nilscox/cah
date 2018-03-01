// @flow

import React from 'react';

import type { GameTurnType } from '../../../../../types/models';
import { toClassName } from '../../../../../utils';

type HistoryTurnProps = {|
  turn: GameTurnType,
  open: boolean,
  toggleOpen: () => void,
|}

const HistoryTurn = ({ turn, open, toggleOpen }: HistoryTurnProps) => (
  <div className={toClassName(['turn', open && 'turn-open'])}>

    <div className="turn-question" onClick={toggleOpen}>
      <span className={toClassName(['arrow', 'arrow--' + (open ? 'open' : 'close')])} />
      {turn.question.text}
    </div>

    <ul className="turn-answers">

      {turn.answers.map(answer => (
        <li key={'turn-' + turn.number + '-answer-' + answer.answered_by} className={[
          'turn-answer',
          turn.winner === answer.answered_by ? ' winner' : '',
        ].join('')}>

          <span className="player-nick">{answer.answered_by}</span>: {answer.text}

        </li>
      ))}

    </ul>

  </div>
);

type GameHistoryProps = {|
  history: Array<GameTurnType>,
|};

type GameHistoryState = {|
  openGameTurns: Array<number>,
|};

export default class GameHistory extends React.Component<GameHistoryProps, GameHistoryState> {

  constructor(props: GameHistoryProps) {
    super(props);

    this.state = {
      openGameTurns: [],
    };
  }

  toggleTurn(n: number) {
    const { openGameTurns } = this.state;
    const idx = openGameTurns.indexOf(n);

    if (idx >= 0)
      openGameTurns.splice(idx, 1);
    else
      openGameTurns.push(n);

    this.setState({ openGameTurns });
  }

  render() {
    const { history } = this.props;
    const { openGameTurns } = this.state;

    const isTurnOpen = turn => openGameTurns.indexOf(turn.number) >= 0;

    return (
      <div id="game-history">

        {history.slice().reverse().map(turn => (
          <HistoryTurn
            key={'turn-' + turn.number}
            turn={turn}
            open={isTurnOpen(turn)}
            toggleOpen={() => this.toggleTurn(turn.number)}
          />
        ))}

      </div>
    );
  }
}
