import * as React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

const mapStateToProps = (state) => {
    return {
        players: state.players,
    };
};

const Row = ({ player }) => (
    <tr>
        <td>{player.nick}</td>
        <td>{player.connected.toString()}</td>
        <td>{player.score}</td>
    </tr>
);

const Players = ({ players }) => (
    <div>

        <h1>Players</h1>

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

export default connect(mapStateToProps)(Players);
