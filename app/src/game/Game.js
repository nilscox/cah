// @flow

import * as React from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '~/types/navigation';
import type { Game as GameType } from '~/redux/state/game';
import type { Player } from '~/redux/state/player';
import { fetchGame, startGame } from '~/redux/actions';
import styles from './Game.styles';
import StartGameButton from './StartGameButton';
import QuestionCard from './QuestionCard';
import ChoiceCard from './ChoiceCard';

type GameStatePropsType = {
  player: Player,
  game: ?GameType,
};

type GameDispatchPropsType = {
  fetchGame: Function,
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
  fetchGame: () => dispatch(fetchGame()),
  startGame: () => dispatch(startGame()),
});

class Game extends React.Component<GamePropsType> {
  static navigationOptions = () => {
    return {
      title: 'CAH',
      headerStyle: {
        backgroundColor: '#4286f4',
      },
      headerTintColor: '#eee',
      headerRight: (
        <Button onPress={() => {}} title="..." />
      ),
    };
  };

  componentDidMount() {
    const { navigation } = this.props;

    this.props.fetchGame()
      .then(() => {
        if (this.props.game)
          navigation.navigate('Game');
      });
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
