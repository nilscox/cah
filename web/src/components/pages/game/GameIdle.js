import React from 'react';
import {connect} from 'react-redux';
import Button from 'material-ui/Button';
import {startGame} from '../../../actions';

const mapStateToProps = state => ({
  canStart: state.game.owner === state.player.nick,
});

const mapDispatchToProps = dispatch => ({
  onStart: () => dispatch(startGame()),
});

const StartButton = ({ onStart }) => (
  <Button raised color="primary" className="start-button" onClick={onStart}>Start!</Button>
);

const GameIdle = ({ canStart, onStart }) => (
  <div id="page-game" className="page">
    <div className="game-idle">
      <h2>Get ready!!</h2>
      <h4>Waiting for the game to start...</h4>
      {canStart && <StartButton onStart={onStart} />}
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(GameIdle);
