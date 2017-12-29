import React from 'react';
import Button from 'material-ui/Button';

const StartButton = ({ onStart }) => (
  <Button raised color="primary" className="start-button" onClick={onStart}>Start!</Button>
);

const GameIdle = ({ player, game, onStart }) => (
  <div id="page-game" className="page">
    <div className="game-idle">
      <h2>Get ready!!</h2>
      <h4>Waiting for the game to start...</h4>
      {player.nick === game.owner && <StartButton onStart={onStart} />}
    </div>
  </div>
);

export default GameIdle;
