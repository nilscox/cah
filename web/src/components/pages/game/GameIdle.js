import React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
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

const GameIdle = ({ players, canStart, onStart }) => (
  <div className="page" id="page-game-idle">
    <div className="container">

      <h2>Get ready!!</h2>

      <h4>Waiting for the game to start...</h4>

      {canStart && <StartButton onStart={onStart} />}

      <ul className="players-list">
        {players.map(player => (
          <li
            key={player.nick}
            className={['player', !player.connected && 'player-offline'].toClassName()}>
            {player.nick}
          </li>
        ))}
      </ul>

    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(GameIdle);
