// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
/* eslint-disable-next-line import/named */
import { Svg } from 'expo';

import type { Game } from '~/redux/state/game';
import type { NavigationPropsType } from '~/types/navigation';
import { joinGame } from '~/redux/actions';
import GamesList from './components/GamesList';
import CreateGameButton from './components/CreateGameButton';

type StatePropsType = {
  games: ?Array<Game>,
  currentGame: ?Game,
};

type DispatchPropsType = {
  joinGame: Function,
};

type LobbyPropsType =
  & StatePropsType
  & DispatchPropsType
  & NavigationPropsType;

const mapStateToProps = ({ games, game }) => ({
  games,
  currentGame: game,
});

const mapDispatchToProps: Function => DispatchPropsType = (dispatch) => ({
  joinGame: (id: number) => dispatch(joinGame(id)),
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

class LobbyScreen extends React.Component<LobbyPropsType> {
  componentDidUpdate() {
    const { navigation, currentGame } = this.props;

    if (currentGame)
      navigation.navigate('Game');
  }

  render() {
    const { games, joinGame } = this.props;

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
          { games && <GamesList games={games} joinGame={joinGame} /> }
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
