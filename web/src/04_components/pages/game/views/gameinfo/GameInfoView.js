// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { Dispatch, Action } from 'Types/actions';
import type { PlayerType, GameTurnType } from 'Types/models';
import type { State, SettingsType } from 'Types/state';
import { toggleDarkMode } from 'Actions/settings';
import { logoutPlayer } from 'Actions/player';
import PlayersList from './PlayersList';
import GameHistory from './GameHistory';
import Settings from './Settings';

type GameInfoStateProps = {|
  gameId: number,
  players: Array<PlayerType>,
  isOnline: PlayerType => boolean,
  isMe: PlayerType => boolean,
  hasSubmitted: PlayerType => boolean,
  isQuestionMaster: PlayerType => boolean,
  history: Array<GameTurnType>,
  appSettings: SettingsType,
|};

type GameInfoDispatchProps = {|
  toggleDarkMode: () => Action,
  logout: () => Action,
|};

type GameInfoViewProps =
  & GameInfoStateProps
  & GameInfoDispatchProps;

const mapStateToProps: State => GameInfoStateProps = ({
  player,
  game,
  settings,
}) => ({
  gameId: game.id,
  players: game.players,
  isOnline: player => player.connected,
  isMe: p => p.nick === player.nick,
  hasSubmitted: player => game.has_submitted.indexOf(player.nick) >= 0,
  isQuestionMaster: player => player.nick === game.question_master,
  history: game.history,
  appSettings: settings,
});

const mapDispatchToProps: Dispatch => GameInfoDispatchProps = dispatch => ({
  toggleDarkMode: () => dispatch(toggleDarkMode()),
  logout: () => dispatch(logoutPlayer()),
});

const GameInfoView = ({
  gameId,
  players,
  isOnline,
  isMe,
  hasSubmitted,
  isQuestionMaster,
  history,
  appSettings,
  toggleDarkMode,
  logout,
}: GameInfoViewProps) => (
  <div className="game-view" id="game-info">

    <div className="game-title">Game-{gameId}</div>

    <h2>Players</h2>
    <PlayersList
      players={players}
      isMe={isMe}
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
        logout,
      }}
    />

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(GameInfoView);
