import * as React from 'react';
import { connect } from 'react-redux';

import GamesInfo from './GamesInfo';
import CreateGame from './CreateGame';
import GamesList from './GamesList';

import './Games.css';

const mapStateToProps = (state) => {
  return {
    games: state.get('games').toJSON(),
    players: state.get('players').toJSON(),
  };
};

const Games = ({ games, players }) => (
  <div className="games">

    <div className="games-top">

      <GamesInfo />

      <CreateGame players={players}/>

    </div>

    <GamesList games={games} />

  </div>
);

export default connect(mapStateToProps)(Games);
