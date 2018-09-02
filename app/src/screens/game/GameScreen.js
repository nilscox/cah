import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { fetchGame, fetchGameHistory } from '../../services/game-service';
import { emitter as websocket } from '../../services/websocket-service';

import Loading from '../../components/Loading';
import QuestionCard from '../../components/QuestionCard';

import GameIdle from './GameIdle/GameIdle';
import GameFinished from './GameFinished/GameFinished';
import PlayersAnswer from './PlayersAnswer/PlayersAnswer';
import QuestionMasterSelection from './QuestionMasterSelection/QuestionMasterSelection';
import EndOfTurn from './EndOfTurn/EndOfTurn';


/** GameScreen
props:
  - match

state:
  - game
  - history
*/

export default class GameScreen extends React.Component {

  state = {
    game: null,
    history: null,
  };

  async componentDidMount() {
    const { params } = this.props.match;
    const { res, json } = await fetchGame(params.id);

    if (res.status === 200) {
      const history = await fetchGameHistory(params.id);

      if (history.res === 200)
        console.log(json);
      else
        this.setState({ game: json, history: history.json });
    } else
      console.log(json);


    websocket.on('game:update', this.handleGameChange);
    websocket.on('game:turn', this.handleGameTurn);
  }

  componentWillUnmount() {
    websocket.off('game:update', this.handleGameChange);
    websocket.off('game:turn', this.handleGameTurn);
  }

  handleGameChange = (game) => {
    this.setState({ game });
  };

  handleGameTurn = (turn) => {
    this.setState({ history: [...this.state.history, turn] });
  };

  render() {
    const { player } = this.props;
    const { game, history } = this.state;

    if (!game)
      return <Loading />;

    if (game.state === 'idle')
      return <GameIdle player={player} game={game} />;

    if (game.state === 'finished')
      return <GameFinished game={game} history={history} />;

    if (game.playState === 'players_answer')
      return <PlayersAnswer player={player} game={game} />;

    if (game.playState === 'question_master_selection')
      return <QuestionMasterSelection player={player} game={game} />;

    if (game.playState === 'end_of_turn')
      return <EndOfTurn player={player} game={game} />;

    return null;
  }
}
