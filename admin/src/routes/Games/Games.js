import * as React from 'react';
import { connect } from 'react-redux';
import { Table, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import './Games.css';

const mapStateToProps = (state) => {
  return {
    games: state.get('games').toJSON(),
    players: state.get('players').toJSON(),
  };
};

const SelectPlayer = ({ player }) => (
  <option value={player.nick}>{player.nick}</option>
);

const Row = ({ game }) => (
  <tr>
    <td>{game.id}</td>
    <td>{game.owner}</td>
    <td>{game.players.length}</td>
    <td>{game.state}</td>
    <td>{game.play_state && game.play_state.replace(/_/g, ' ')}</td>
    <td>{game.turns.length}</td>
  </tr>
);

const Games = ({ games, players }) => (
  <div className="games">

    <div className="games-top">

      <div className="games-info">
        {/* game info */}
      </div>

      <form className="add-game-form">

        <FormGroup>

          <ControlLabel>Select owner</ControlLabel>

          <FormControl componentClass="select">
            {players.map((player) => <SelectPlayer key={`player-${player.nick}`} player={player} />)}
          </FormControl>

        </FormGroup>

        <FormGroup>

          <ControlLabel>Select lang</ControlLabel>

          <FormControl componentClass="select">

            <option value="en">English</option>
            <option value="fr">Français</option>
          </FormControl>


        </FormGroup>

        <Button bsClass="add-button btn" type="submit">
          Create Game
        </Button>

      </form>

    </div>

    <Table className="games-list" bordered condensed striped>

      <thead>
        <tr>
          <th>id</th>
          <th>Owner</th>
          <th>Players</th>
          <th>State</th>
          <th>Play State</th>
          <th>Turn</th>
        </tr>
      </thead>

      <tbody>
        {games.map((game) => <Row  key={`game-${game.id}`} game={game} />)}
      </tbody>

    </Table>

  </div>
);

export default connect(mapStateToProps)(Games);
