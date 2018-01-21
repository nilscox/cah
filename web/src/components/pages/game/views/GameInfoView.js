import React from 'react';
import { connect } from 'react-redux';

{/*<div className={"player-item-nick"}><span className={"player-item-arrow"}>{isOpen ? '▾' : '▸'}</span> {player.nick}</div>*/}

const PlayerItem = ({ nick, score, questionMaster, online, submitted }) => {
  const clazz = ['player-item'];

  if (questionMaster)
    clazz.push('question-master');

  if (!online)
    clazz.push('offline');

  if (submitted)
    clazz.push('submitted');

  return (
    <div className={clazz.join(' ')}>
      <span className={"player-item-score"}>{score}</span>
      <span className={"player-item-nick"}>{nick}</span>
      <span className={"player-item-submitted"}>✔</span>
    </div>
  );
};

const mapStateToProps = state => ({
  gameId: state.game.id,
  questionMaster: state.game.question_master,
  players: state.game.players,
  submitted: state.game.has_submitted,
});

const mapDispatchToProps = dispatch => ({

});

class InfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPlayers: [],
    };
  }

  render() {
    const { gameId, questionMaster, players, submitted } = this.props;
    const isQuestionMaster = player => questionMaster === player.nick;
    const isOnline = player => player.connected;
    const hasSubmitted = player => submitted.indexOf(player.nick) >= 0;

    return (
      <div className="game-info-view">
        <div className="game-title">Game-{gameId}</div>
        <div className="players-list">
          <div className="players-list-label">Players</div>
          <ul>
            {players.map(player => (
              <li key={"player-" + player.nick}>
                <PlayerItem
                  nick={player.nick}
                  score={player.score}
                  online={isOnline(player)}
                  submitted={hasSubmitted(player)}
                  questionMaster={isQuestionMaster(player)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="game-history">
          <div className="game-history-label">History</div>
          <ul>

          </ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoView);