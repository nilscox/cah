import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

const mapStateToProps = (state) => ({
  games: state.games,
});

const mapDispatchToProps = (dispatch) => ({});

const GameDetails = ({ match, games }: GameDetailsProps) => {
  // eslint-disable-next-line eqeqeq
  const game = games.find(g => g.id == match.params.id);

  if (!game)
    return <Redirect to="/games" />;

  return (
    <div>
      <h2>Game #{ game.id }</h2>
      <pre>{ JSON.stringify(game, 2, 2) }</pre>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameDetails);
