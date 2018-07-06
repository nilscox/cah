import * as React from 'react';
import { connect } from 'react-redux';

import { createGame } from '../../redux/actions';

import GamesInfo from './GamesInfo';
import CreateGame from './CreateGame';
import GamesList from './GamesList';

import './Games.css';

const mapStateToProps = (state) => {
  return {
    games: state.games,
    players: state.players,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSubmit: (owner, lang) => dispatch(createGame(owner, lang)),
  }
};


const Games = ({ games, players, handleSubmit }) => (
  <div className="games">

    <div className="games-top">
      <GamesInfo />
      <CreateGame players={players} onSubmit={handleSubmit}/>
    </div>

    <GamesList games={games} />

  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Games);
