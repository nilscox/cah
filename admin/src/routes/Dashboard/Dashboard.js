import * as React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ players, games }) => ({
  nbPlayers: players.keys().length,
  nbOnlinePlayers: players.values().filter(p => p.connected).length,
  nbGames: games.keys().length,
  nbStartedGames: games.values().filter(g => g.state === 'started').length,
});

const Dashboard = ({ nbPlayers, nbOnlinePlayers, nbGames, nbStartedGames }) => (
  <div>
    <h1>Dashboard</h1>

    <p>
      <b>{nbPlayers}</b> players (<b>{nbOnlinePlayers}</b> online)
    </p>

    <p>
      <b>{nbGames}</b> games (<b>{nbStartedGames}</b> running)
    </p>

  </div>
);

export default connect(mapStateToProps)(Dashboard);
