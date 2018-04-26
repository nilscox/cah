// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Svg } from 'expo';

import type { Game } from '~/types/game';
import type { State } from './reducer';
import { listGames } from './actions';
import GamesList from './components/GamesList';
import CreateGameButton from './components/CreateGameButton';

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

const mapStateToProps: { lobby: State } => StatePropsType = ({ lobby }) => ({
  games: lobby.gamesList,
});

const mapDispatchToProps: Function => DispatchPropsType = (dispatch) => ({
  listGames: () => dispatch(listGames()),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamesListView: {
    flex: 2,
    justifyContent: 'center',
  },
  orView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonView: {
    flex: 1,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  orText: {
    fontSize: 32,
    paddingHorizontal: 15,
  },
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

    const separatorLine = (
      <Svg height="4" width="120">
        <Svg.Line
          x1="0" y1="0"
          x2="120" y2="0"
          stroke="#666"
          strokeWidth="4"
        />
      </Svg>
    );

    return (
      <View style={styles.screen}>

        <View style={styles.gamesListView}>
          { games && <GamesList games={games} /> }
        </View>

        <View style={styles.orView}>
          {separatorLine}
          <Text style={styles.orText}>OR</Text>
          {separatorLine}
        </View>

        <View style={styles.createButtonView}>
          <CreateGameButton />
        </View>

      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);
