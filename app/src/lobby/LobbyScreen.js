// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import type { State } from '../types/state';
import type { Action } from '../types/actions';
import type { Game } from '../types/game';
import { listGames } from './actions';
import GameListItem from './GameListItem';

type StatePropsType = {
  games: ?Array<Game>,
};

type DispatchPropsType = {
  listGames: Function,
};

type LobbyPropsType =
  & StatePropsType
  & DispatchPropsType;

type LobbyStateType = {
  loading: boolean,
};

const mapStateToProps: State => StatePropsType = ({ lobby }) => ({
  games: lobby.gamesList,
});

const mapDispatchToProps: Function => DispatchPropsType = (dispatch) => ({
  listGames: () => dispatch(listGames()),
});

class LobbyScreen extends React.Component<LobbyPropsType, LobbyStateType> {
  state = {
    loading: true,
  };

  componentDidMount() {
    this.props.listGames()
      .then(() => this.setState({ loading: false }))
  }

  render() {
    const { games } = this.props;

    return (
      <View>
        {games && games.map(game => <GameListItem game={game} />)}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);
