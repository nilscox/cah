// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import type { PlayerType, GameTurnType } from '../../../../../types/models';
import type { Action } from '../../../../../types/actions';
import type { State, SettingsType } from '../../../../../types/state';
import { toggleDarkMode } from '../../../../../actions/settings';
import { logoutPlayer } from '../../../../../actions/player';
import PlayersList from './PlayersList';
import GameHistory from './GameHistory';
import Settings from './Settings';

type GameInfoStateProps = {|
  gameId: number,
  questionMaster: string,
  players: Array<PlayerType>,
  submitted: boolean,
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
  game,
  gameHistory,
  settings,
}) => ({
  gameId: game.id,
  questionMaster: game.question_master,
  players: game.players,
  submitted: game.has_submitted,
  history: gameHistory,
  appSettings: settings,
});

const mapDispatchToProps: Function => GameInfoDispatchProps = dispatch => ({
  toggleDarkMode: () => dispatch(toggleDarkMode()),
  logout: () => dispatch(logoutPlayer()),
});

const GameInfoView = ({
  gameId,
  questionMaster,
  players,
  submitted,
  history,
  appSettings,
  toggleDarkMode,
  logout,
}: GameInfoViewProps) => {
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
          logout,
        }}
      />

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GameInfoView);
