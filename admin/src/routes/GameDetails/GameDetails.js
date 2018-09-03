import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

const mapStateToProps = (state) => ({
  getGame: id => state.games[id],
  getHistory: id => state.histories[id],
});

const GameDetails = ({ match, getGame, getHistory }) => {
  const id = parseInt(match.params.id);
  const game = getGame(id);
  const history = getHistory(id);

  if (!game || !history)
    return <Redirect to="/games" />;

  return (
    <div>
      <h2>Game #{ game.id }</h2>
      <pre>{ JSON.stringify(game, 2, 2) }</pre>
      <h3>History</h3>
      <pre>{ JSON.stringify(history, 2, 2) }</pre>
    </div>
  );
};

export default connect(
  mapStateToProps,
)(GameDetails);
