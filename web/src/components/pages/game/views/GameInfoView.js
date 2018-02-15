import React from 'react';
import { connect } from 'react-redux';
import { FormControlLabel, Checkbox, Button } from 'material-ui';
import { toggleDarkMode } from '../../../../actions/settings';
import { logoutPlayer } from '../../../../actions/player';
import GameHistory from "./GameHistory";

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
  history: state.game.history,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  toggleDarkMode: () => dispatch(toggleDarkMode()),
  logout: () => dispatch(logoutPlayer()),
});

class InfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPlayers: [],
    };
  }

  render() {
    const { gameId, questionMaster, players, submitted, history, settings, toggleDarkMode, logout } = this.props;
    const isQuestionMaster = player => questionMaster === player.nick;
    const isOnline = player => player.connected;
    const hasSubmitted = player => submitted.indexOf(player.nick) >= 0;

    return (
      <div className="game-info-view">
        <div className="game-title">Game-{gameId}</div>
        <div className="players-list">
          <h2>Players</h2>
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
          <h2>History</h2>
          <GameHistory history={history} />
        </div>
        <div className="settings">
          <h2>Settings</h2>
          <ul>
            <li>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.darkMode}
                    onChange={toggleDarkMode}
                  />
                }
                label="Dark mode"
              />
            </li>
            <li>
              <Button onClick={logout}>Log out</Button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoView);