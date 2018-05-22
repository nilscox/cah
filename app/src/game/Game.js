// @flow

import * as React from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { NavigationPropsType } from '~/types/navigation';
import type { Game as GameType } from '~/types/game';
import type { Player } from '~/types/player';
import { fetchGame } from '~/actions';
import styles from './Game.styles';
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

const mapStateToProps = ({ auth, game }) => ({
  player: auth.player,
  game: game.game,
});

const mapDispatchToProps = (dispatch) => ({
  fetchGame: () => dispatch(fetchGame()),
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
    this.props.fetchGame();
  }

  render() {
    const { game, player } = this.props;

    if (!game)
      return <View><Text>Loading...</Text></View>;

    if (game.state === 'idle')
      return <View><Text>Waiting for the game to start...</Text></View>;

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
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
