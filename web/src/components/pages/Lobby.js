import React from 'react';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import {
  create as createGame,
  join as joinGame
} from '../../services/game';

const Lobby = ({ setGame, onError }) => {
  let inputGameId = null;

  const onCreate = () => {
    createGame()
      .then(setGame)
      .catch(onError);
  };

  const onJoin = (e) => {
    e.preventDefault();

    joinGame(inputGameId)
      .then(setGame)
      .catch(onError);
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

export default Lobby;
