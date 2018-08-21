import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { fetchGame } from '../../services/game-service';

import Loading from '../../components/Loading';

import GameIdle from './GameIdle/GameIdle';
import GameFinished from './GameFinished/GameFinished';
import PlayersAnswer from './PlayersAnswer/PlayersAnswer';
import QuestionMasterSelection from './QuestionMasterSelection/QuestionMasterSelection';
import EndOfTurn from './EndOfTurn/EndOfTurn';


export default class GameScreen extends React.Component {

  state = {
    game: null,
  };

  async componentDidMount() {
    const { params } = this.props.match;
    const { res, json } = await fetchGame(params.id);

    if (res.status === 200)
      this.setState({ game: json });
    else
      console.log(json);
  }

  render() {
    const getComponent = game => {
      if (game.state === 'idle')
        return GameIdle;

      if (game.state === 'finished')
        return GameFinished;

      if (game.playState === 'players_answer')
        return PlayersAnswer;

      if (game.playState === 'question_master_selection')
        return QuestionMasterSelection;

      if (game.playState === 'end_of_turn')
        return EndOfTurn;
    };

    const { game } = this.state;

    if (!game)
      return <Loading />;

    const Component = getComponent(game);

    if (!Component)
      throw new Error('should not happen');

    return <Component game={game} />;
  }

}
