import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

import { createPlayer } from '../../redux/actions';

import CreatePlayer from './CreatePlayer';
import './Players.css';

const mapStateToProps = (state) => ({
  players: state.players,
});

const mapDispatchToProps = (dispatch) => ({
  handleSubmit: (nick) => dispatch(createPlayer(nick)),
});

const Row = ({ player }) => (
  <tr className="player">
    <td>
      <img
        className="player-avatar"
        src={player.avatar || '/img/default-avatar.png'}
        alt={`avatar-${player.nick}`}
      />
    </td>
    <td>{player.nick}</td>
    <td>{player.connected.toString()}</td>
    <td>{player.score}</td>
  </tr>
);

const Players = ({ players, handleSubmit }) => (
  <div className="players">

    <CreatePlayer onSubmit={handleSubmit}/>

    <Table bordered condensed striped>

      <thead>
        <tr>
          <th>Image</th>
          <th>Nick</th>
          <th>Connected</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        { players.map((player) => (
          <Row key={`player-${player.nick}`} player={player} />
        )) }
      </tbody>

    </Table>

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Players);
