import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { createGame, joinGame } from '../../actions/game';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  createGame: () => dispatch(createGame()),
  joinGame: id => dispatch(joinGame(id)),
});

const Lobby = ({ createGame, joinGame }) => {
  let inputGameId = null;

  const onCreate = () => {
    createGame();
  };

  const onJoin = (e) => {
    e.preventDefault();
    joinGame(inputGameId);
  };

  return (
    <div id="page-lobby" className="page">
      <div className="game-form">
        <form onSubmit={onJoin}>
          <TextField
            label="Join game"
            placeholder="id"
            fullWidth
            onChange={e => inputGameId = e.target.value}/>
        </form>
        <h4 className="or">||</h4>
        <Tooltip title="Create a new game" placement="bottom">
          <Button
            fab mini
            aria-label="Log out"
            className="new-game-button"
            onClick={onCreate}>
            <AddIcon/>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

Lobby.propTypes = {
  createGame: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
