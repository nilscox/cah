import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { fetchGame, fetchGameHistory } from '../../services/game-service';
import { emitter as websocket } from '../../services/websocket-service';

import Loading from '../../components/Loading';
import QuestionCard from '../../components/QuestionCard';

import screen from '../screen.styles.js';
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

const styles = StyleSheet.create({
  questionMaster: {
    textAlign: 'center',
    marginBottom: 15,
  },
  turnNumber: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
});

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


    websocket.on('player:update', this.handlePlayerChange);
    websocket.on('game:update', this.handleGameChange);
    websocket.on('game:turn', this.handleGameTurn);
  }

  componentWillUnmount() {
    websocket.off('player:update', this.handlePlayerChange);
    websocket.off('game:update', this.handleGameChange);
    websocket.off('game:turn', this.handleGameTurn);
  }

  handlePlayerChange = (player) => {
    const { game } = this.state;
    const players = game.players.slice();
    const idx = players.findIndex(p => p.nick === player.nick);

    if (idx < 0)
      return;

    players.splice(idx, 1, player);

    this.setState({
      game: {
        ...game,
        players,
      },
    });
  };

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

    const displayTurnNumber = game.state === 'started';
    let title = null;
    let view = null;

    if (game.state === 'idle') {
      title = 'Game idle';
      view = <GameIdle player={player} game={game} />;
    }

    if (game.state === 'finished') {
      title = 'Game finished';
      view = <GameFinished game={game} history={history} />;
    }

    if (game.playState === 'players_answer') {
      title = 'Players answer';
      view = <PlayersAnswer player={player} game={game} />;
    }

    if (game.playState === 'question_master_selection') {
      title = 'Question Master selection';
      view = <QuestionMasterSelection player={player} game={game} />;
    }

    if (game.playState === 'end_of_turn') {
      title = 'End of turn';
      view = <EndOfTurn player={player} game={game} />;
    }

    return (
      <View style={screen.view}>
        { this.renderHeader(title, game.questionMaster) }
        { view }
        { displayTurnNumber && (
          <View style={styles.turnNumber}>
            <Text>#{ game.currentTurn }</Text>
          </View>
        ) }
      </View>
    );
  }

  renderHeader(title, questionMaster) {
    return (
      <View style={styles.header}>
        <Text style={screen.title}>{ title }</Text>
        { questionMaster && (
          <Text style={styles.questionMaster}>Question Master : { questionMaster }</Text>
        ) }
      </View>
    );
  }

}
