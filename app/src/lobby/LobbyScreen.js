// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import { listGames } from './actions';
import GameListItem from './GameListItem';

const mapStateToProps = ({ lobby }) => ({
  games: lobby.gamesList,
});

const mapDispatchToProps = (dispatch) => ({
  listGames: () => dispatch(listGames()),
});

class LobbyScreen extends React.Component {
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
        {games && games.map(GameListItem)}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);