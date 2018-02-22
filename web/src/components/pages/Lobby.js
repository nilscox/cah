import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { createGame, joinGame } from '../../actions/game';

const mapDispatchToProps = dispatch => ({
  createGame: () => dispatch(createGame()),
  joinGame: id => dispatch(joinGame(id)),
});

type LobbyProps = {
  createGame: () => void,
  joinGame: number => void,
};

const Lobby = ({ createGame, joinGame }: LobbyProps) => {
  const onJoin = evt => {
    if (evt.key === 'Enter')
      joinGame(inputGameId);
  };

  let inputGameId = null;

  return (
    <div id="page-lobby" className="page">
      <div className="container">
        <div className="join-game">
          <TextField
            className="join-input-game-id"
            label="Join game"
            placeholder="id"
            fullWidth
            onChange={e => inputGameId = e.target.value}
            onKeyPress={onJoin}
          />
        </div>
        <h4 className="or">||</h4>
        <div className="create-game">
          <Tooltip title="Create a new game" placement="bottom">
            <Button
              variant="fab"
              mini={true}
              aria-label="Create game"
              className="create-game-button"
              onClick={createGame}>
              <AddIcon/>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Lobby);
