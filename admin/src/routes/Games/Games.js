import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';

import { createGame } from '../../redux/actions';

import GamesInfo from './GamesInfo';
import CreateGame from './CreateGame';
import GamesList from './GamesList';
import GameDetails from './GameDetails';

import './Games.css';

const mapStateToProps = (state) => {
  return {
    games: state.get('games').toJSON(),
    players: state.get('players').toJSON(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSubmit: (owner, lang) => dispatch(createGame(owner, lang)),
  }
};


const Games = ({ games, players, handleSubmit }) => {
  const Game = ({ match }) => {
    /* eslint-disable-next-line eqeqeq */
    const game = games.find(g => g.id == match.params.id);

    return game
      ? <GameDetails game={game} />
      : <Redirect to="/games" />;

  }

  return (
    <div className="games">

      <div className="games-top">

        <GamesInfo />

        <CreateGame players={players} onSubmit={handleSubmit}/>

      </div>

      <Switch>
        <Route path="/games/:id" exact component={Game} />
        <Route exact path="/games" render={() => <GamesList games={games} />} />
      </Switch>

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Games);
