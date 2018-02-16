import React, { Component } from 'react';

const GameHistoryTurn = ({ turn, open, toggleOpen }) => (
  <div className={'game-history-turn' + (open ? ' game-history-turn-open' : '')}>
    <div className={'game-history-turn-question'} onClick={toggleOpen}>
      <span className={'game-history-turn-open-arrow'}>{open ? '▾' : '▸'}</span>
      {turn.question.text}
    </div>
    <ul className="game-history-turn-answers">
      {turn.answers.map(answer => (
        <li key={'turn-' + turn.number + '-answer-' + answer.answered_by} className={[
          'game-history-turn-answer',
          turn.winner === answer.answered_by ? ' winner' : '',
        ].join('')}>
          <span className={'player-nick'}>{answer.answered_by}</span>: {answer.text}
        </li>
      ))}
    </ul>
  </div>
);

export default class GameHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openGameTurns: [],
    };
  }

  toggleTurn(n) {
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
      <div className="game-history-turns">
        {history.map(turn => (
          <GameHistoryTurn
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
