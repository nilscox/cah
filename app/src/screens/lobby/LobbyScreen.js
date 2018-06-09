// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
/* eslint-disable-next-line import/named */
import Svg, { Line } from 'react-native-svg';

import type { Game } from '~/redux/state/game';
import type { Player } from '~/redux/state/player';
import type { NavigationProps } from '~/types/navigation';
import { listGames, joinGame } from '~/redux/actions';
import MenuButton from '~/components/MenuButton';
import GamesList from './components/GamesList';
import CreateGameButton from './components/CreateGameButton';
import styles from './LobbyScreen.styles';

type StatePropsType = {
  player: ?Player,
  games: ?Array<Game>,
  currentGame: ?Game,
};

type DispatchPropsType = {
  reloadGamesList: Function,
  joinGame: Function,
};

type LobbyPropsType =
  & StatePropsType
  & DispatchPropsType
  & NavigationProps;

const mapStateToProps = ({ player, games, game }) => ({
  player,
  games,
  currentGame: game,
});

const mapDispatchToProps: Function => DispatchPropsType = (dispatch) => ({
  reloadGamesList: () => dispatch(listGames()),
  joinGame: (id: number) => dispatch(joinGame(id)),
});

class LobbyScreen extends React.Component<LobbyPropsType> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CAH',
      headerRight: (
        <MenuButton
          navigation={navigation}
          displayOptions={{
            Profile: { route: 'Profile' },
            Settings: { route: 'Settings' },
          }}
          canLogOut
        />
      ),
    };
  };

  componentDidMount() {
    const { navigation, player } = this.props;

    this.redirectIfInGame();
    navigation.setParams({ 'player': player });
  }

  componentDidUpdate() {
    this.redirectIfInGame();
  }

  redirectIfInGame() {
    const { navigation, currentGame } = this.props;

    if (currentGame)
      navigation.navigate('Game');
  }

  render() {
    const { games, joinGame, reloadGamesList } = this.props;

    const separatorLine = (
      <Svg height="4" width="120">
        <Line
          x1="0" y1="0"
          x2="120" y2="0"
          stroke="#666"
          strokeWidth="2"
        />
      </Svg>
    );

    return (
      <View style={styles.screen}>

        <View style={styles.gamesListView}>
          { games && (
            <GamesList
              games={games}
              joinGame={joinGame}
              reloadGamesList={reloadGamesList}
            />
          ) }
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
