import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

import { createPlayer } from '../../redux/actions';

import CreatePlayer from './CreatePlayer'

const mapStateToProps = (state) => {
    return {
        players: state.players,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSubmit: (nick) => dispatch(createPlayer(nick)),
  }
}; 

const Row = ({ player }) => (
    <tr>
        <td>{player.nick}</td>
        <td>{player.connected.toString()}</td>
        <td>{player.score}</td>
    </tr>
);

const Players = ({ players, handleSubmit }) => (
    <div>

        <CreatePlayer onSubmit={handleSubmit}/>

        <Table bordered condensed striped>

            <thead>
                <tr>
                    <th>Nick</th>
                    <th>Connected</th>
                    <th>Score</th>
                </tr>
            </thead>

            <tbody>
                {players.map((player) => <Row key={`player-${player.nick}`} player={player} />)}
            </tbody>

        </Table>

    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Players);
