import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

import CreateGame from './CreateGame';
import GamesInfo from './GamesInfo';

import './Games.css';

const mapStateToProps = (state) => {
  return {
    games: state.get('games').toJSON(),
    players: state.get('players').toJSON(),
  };
};

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

      <GamesInfo />

      <CreateGame players={players}/>

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
