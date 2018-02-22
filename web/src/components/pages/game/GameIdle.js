// @flow

import React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';

import type { PlayerType } from '../../../types/models';
import { toClassName } from '../../../utils';
import { startGame } from '../../../actions/game';

const mapStateToProps = state => ({
  players: state.game.players,
  canStart: state.game.owner === state.player.nick,
});

const mapDispatchToProps = dispatch => ({
  onStart: () => dispatch(startGame()),
});

const StartButton = ({ onStart }) => (
  <Button raised color="primary" className="start-button" onClick={onStart}>Start!</Button>
);

type GameIdleProps = {
  players: Array<PlayerType>,
  canStart: boolean,
  onStart: () => void,
};

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
