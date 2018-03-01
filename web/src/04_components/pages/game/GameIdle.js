// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';

import type { Dispatch, Action } from '../../../types/actions';
import type { State } from '../../../types/state';
import type { PlayerType } from '../../../types/models';
import { toClassName } from '../../../utils';
import { startGame } from '../../../actions/game';

type GameIdleStateProps = {|
  players: Array<PlayerType>,
  canStart: boolean,
|};

type GameIdleDispatchProps = {|
  onStart: () => Action,
|};

type GameIdleProps =
  & GameIdleStateProps
  & GameIdleDispatchProps;

const mapStateToProps: State => GameIdleStateProps = state => ({
  players: state.game.players,
  canStart: state.game.owner === state.player.nick,
});

const mapDispatchToProps: Dispatch => GameIdleDispatchProps = dispatch => ({
  onStart: () => dispatch(startGame()),
});

const StartButton = ({ onStart }) => (
  <Button variant="raised" color="primary" className="start-button" onClick={onStart}>Start!</Button>
);

const GameIdle = ({ players, canStart, onStart }: GameIdleProps) => (
  <div className="page" id="page-game-idle">
    <div className="container">

      <h2>Get ready!!</h2>

      <h4>Waiting for the game to start...</h4>

      {canStart && <StartButton onStart={onStart} />}

      <ul className="players-list">
        {players.map(player => (
          <li
            key={player.nick}
            className={toClassName(['player', !player.connected && 'player-offline'])}>
            {player.nick}
          </li>
        ))}
      </ul>

    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(GameIdle);
