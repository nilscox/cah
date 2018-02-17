import React from 'react';
import { connect } from 'react-redux';
import { FormControlLabel, Checkbox, Button } from 'material-ui';

import { toggleDarkMode } from '../../../../../actions/settings';
import { logoutPlayer } from '../../../../../actions/player';

import PlayerAvatar from '../../../../common/PlayerAvatar';
import GameHistory from "./GameHistory";

const mapStateToProps = state => ({
  gameId: state.game.id,
  questionMaster: state.game.question_master,
  players: state.game.players,
  submitted: state.game.has_submitted,
  history: state.game.history,
  appSettings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  toggleDarkMode: () => dispatch(toggleDarkMode()),
  logout: () => dispatch(logoutPlayer()),
});

const GameInfoView = ({ gameId, questionMaster, players, submitted, history, appSettings, toggleDarkMode, logout }) => {
  const isQuestionMaster = player => questionMaster === player.nick;
  const isOnline = player => player.connected;
  const hasSubmitted = player => submitted.indexOf(player.nick) >= 0;

  const playersList = (
    <div className="players-list">
      {players.map(player => (
        <PlayerAvatar
          key={'player-' + player.nick}

          className={[
            'player',
            hasSubmitted(player) && 'has-submitted',
            isQuestionMaster(player) && 'is-question-master',
          ].toClassName()}

          player={{
            nick: player.nick,
            avatar: '/img/default_avatar.png',
            connected: isOnline(player),
          }}

          tooltip={'score: ' + player.score}
        />
      ))}
    </div>
  );

  const settings = (
    <div className="settings">
      <div className="dark-mode">
        <FormControlLabel
          control={
            <Checkbox
              checked={appSettings.darkMode}
              onChange={toggleDarkMode}
            />
          }
          label="Dark mode"
        />
      </div>
      <Button onClick={logout}>Log out</Button>
    </div>
  );

  return (
    <div className="game-view" id="game-info">

      <div className="game-title">Game-{gameId}</div>

      <h2>Players</h2>
      {playersList}

      <h2>History</h2>
      <GameHistory history={history} />

      <h2>Settings</h2>
      {settings}

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GameInfoView);
