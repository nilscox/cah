import * as React from 'react';
import { Table } from 'react-bootstrap';

import './GamesList.css';

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

const GamesList = ({ games }) => {
  return (
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
  );
};

export default GamesList;
