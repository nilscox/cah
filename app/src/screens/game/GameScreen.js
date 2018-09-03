import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { getInstruction } from '../../services/math-service';
import { fetchGame, fetchGameHistory } from '../../services/game-service';
import { emitter as websocket } from '../../services/websocket-service';

import Loading from '../../components/Loading';
import { IconButton } from '../../components/Icon';

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
  actions: {
    flexDirection: 'row',
    padding: 10,
  },
  actionsLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionsRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  action: {
    marginHorizontal: 10,
  },
});

const GameActions = ({ player, game, toast, go }) => (
  <View style={styles.actions}>

    <View style={styles.actionsLeft}>
      <View style={styles.action}>
        <IconButton
          onPress={() => toast(getInstruction(player, game))}
          type="info"
          size="medium"
          style={styles.settingsIcon}
        />
      </View>
    </View>

    <View style={styles.actionsRight}>

      <View style={styles.action}>
        <IconButton
          onPress={() => go('/player', { player })}
          type="profile"
          size="medium"
          style={styles.profileIcon}
        />
      </View>

      <View style={styles.action}>
        <IconButton
          onPress={() => {}}
          type="settings"
          size="medium"
          style={styles.settingsIcon}
        />
      </View>

    </View>

  </View>
);

export default class GameScreen extends React.Component {

  state = {
    game: null,
    history: null,
  };

  async componentDidMount() {
    const { params } = this.props.match;
    const { res, json } = await fetchGame(params.id);

    if (res.status === 200) {
      const { res: hres, json: hjson } = await fetchGameHistory(params.id);

      if (hres.status === 200)
        this.setState({ game: json, history: hjson });
      else
        this.props.onError('fetchGameHistory', hjson);
    } else
      this.props.onError('fetchGame', json);

    websocket.on('player:update', this.handlePlayerChange);
    websocket.on('player:cards', this.handlePlayerCards);
    websocket.on('game:answer', this.handleGameAnswer);
    websocket.on('game:update', this.handleGameChange);
    websocket.on('game:turn', this.handleGameTurn);
  }

  componentWillUnmount() {
    websocket.off('player:update', this.handlePlayerChange);
    websocket.off('player:cards', this.handlePlayerCards);
    websocket.off('game:answer', this.handleGameAnswer);
    websocket.off('game:update', this.handleGameChange);
    websocket.off('game:turn', this.handleGameTurn);
  }

  handlePlayerCards = (cards) => {
    const l = cards.length;

    this.props.toast(`${l} new card${l > 1 ? 's' : ''}!`, 3000);
  };

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

  handleGameAnswer = (player) => {
    if (player !== this.props.player.nick)
      this.props.toast(player + ' answered');
  };

  handleGameChange = (game) => {
    this.setState({ game });
  };

  handleGameTurn = (turn) => {
    this.setState({ history: [...this.state.history, turn] });
    this.props.setPlayer({
      ...this.props.player,
      submitted: null,
    });
  };

  handlePlayerAnswer = (cards) => {
    const keepCard = ({ id }) => !cards.find(c => c.id === id);

    this.props.setPlayer({
      ...this.props.player,
      submitted: { choices: cards },
      cards: this.props.player.cards.filter(keepCard),
    });
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
      view = <PlayersAnswer player={player} game={game} onAnswer={this.handlePlayerAnswer} />;
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

        { this.renderTop(title, game.questionMaster) }

        { view }

        <GameActions
          player={player}
          game={game}
          history={history}
          toast={this.props.toast}
          go={this.props.history.push}
        />

        { displayTurnNumber && (
          <View style={styles.turnNumber}>
            <Text>#{ game.currentTurn }</Text>
          </View>
        ) }

      </View>
    );
  }

  renderTop(title, questionMaster) {
    return (
      <View style={styles.top}>

        <Text style={screen.title}>{ title }</Text>

        { questionMaster && (
          <Text style={styles.questionMaster}>Question Master : { questionMaster }</Text>
        ) }

      </View>
    );
  }

}
