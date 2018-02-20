import React from 'react';
import { connect } from 'react-redux';

import { toggleDarkMode } from '../../../../../actions/settings';
import { logoutPlayer } from '../../../../../actions/player';

import PlayersList from './PlayersList';
import GameHistory from './GameHistory';
import Settings from './Settings';

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
  const isOnline = player => player.connected;
  const isQuestionMaster = player => questionMaster === player.nick;
  const hasSubmitted = player => submitted.indexOf(player.nick) >= 0;

  return (
    <div className="game-view" id="game-info">

      <div className="game-title">Game-{gameId}</div>

      <h2>Players</h2>
      <PlayersList
        players={players}
        isOnline={isOnline}
        isQuestionMaster={isQuestionMaster}
        hasSubmitted={hasSubmitted}
    />

      <h2>History</h2>
      <GameHistory history={history} />

      <h2>Settings</h2>
      <Settings
        settings={appSettings}
        actions={{
          toggleDarkMode,
          logout
        }}
      />

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GameInfoView);
