// @flow

import * as React from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '~/types/navigation';
import type { Game as GameType } from '~/redux/state/game';
import type { Player } from '~/redux/state/player';
import { startGame } from '~/redux/actions';
import MenuButton from '~/components/MenuButton';
import styles from './Game.styles';
import StartGameButton from './components/StartGameButton';
import QuestionCard from './components/QuestionCard';
import ChoiceCard from './components/ChoiceCard';

type GameStatePropsType = {
  player: Player,
  game: ?GameType,
};

type GameDispatchPropsType = {
  startGame: Function,
};

type GamePropsType =
  & NavigationPropsType
  & GameStatePropsType
  & GameDispatchPropsType;

const mapStateToProps = ({ player, game }) => ({
  player,
  game,
});

const mapDispatchToProps = (dispatch) => ({
  startGame: () => dispatch(startGame()),
});

class Game extends React.Component<GamePropsType> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CAH',
      headerRight: (
        <MenuButton
          navigation={navigation}
          displayOptions={{
            Game: {
              route: 'GameInfo',
              args: { game: navigation.getParam('game') },
            },
            Profile: { route: 'Profile' },
            Settings: { route: 'Settings' },
          }}
        />
      ),
    };
  };

  componentDidMount() {
    this.redirectIfNotInGame();
    this.props.navigation.setParams({ 'game': this.props.game });
  }

  componentDidUpdate() {
    this.redirectIfNotInGame();
  }

  redirectIfNotInGame() {
    const { navigation, player, game } = this.props;

    if (!player)
      navigation.navigate('Auth');
    else if (!game)
      navigation.navigate('Lobby');
  }

  render() {
    const { game, player } = this.props;

    if (!game)
      return <View><Text>Loading...</Text></View>;

    if (game.state === 'idle')
      return this.renderGameIdle();

    return (
      <View style={styles.wrapper}>

        <View style={styles.questionView}>
          <QuestionCard question={game.question} />
        </View>

        <View style={styles.choicesView}>
          <FlatList
            keyExtractor={(card) => `card-${card.id}`}
            data={player.cards}
            renderItem={({ item }) => <ChoiceCard choice={item} />}
          />
        </View>

      </View>
    );
  }

  renderGameIdle() {
    const { player, game, startGame } = this.props;

    if (player.nick === game.owner)
      return <StartGameButton startGame={startGame} />;
    else
      return <View><Text>Waiting for the game to start...</Text></View>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
