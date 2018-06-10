// @flow

import * as React from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { Player } from '~/redux/state/player';
import type { Question } from '~/redux/state/question';
import type { AnsweredQuestion } from '~/redux/state/answeredQuestion';
import { nextTurn } from '~/redux/actions/game';
import PlayerAvatar from '~/components/PlayerAvatar';
import QuestionCard from '../PlayersAnswer/QuestionCard';

import styles from './EndOfTurn.styles';

type EndOfTurnProps = {
  number: number,
  winner: Player,
  question: Question,
  answers: Array<AnsweredQuestion>,
  isQuestionMaster: (Player) => boolean,
  nextTurn: Function,
};

const mapStateToProps = ({ player, game }) => {
  const turn = game.history[game.history.length - 1];
  const winner = game.players.find(p => p.nick === turn.winner);

  return {
    number: turn.number,
    winner,
    question: turn.question,
    answers: turn.answers,
    isQuestionMaster: (player) => player.nick === turn.question_master,
    isWinner: (player) => player === winner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  nextTurn: () => dispatch(nextTurn()),
});

const EndOfTurn = ({
  number,
  winner,
  question,
  answers,
  canGoNext,
  isQuestionMaster,
  nextTurn,
}: EndOfTurnProps) => (
  <View style={styles.wrapper}>

    <Text style={styles.turnNumber}>#{ number }</Text>

    <Image style={styles.crown} source={require('./crown.png')} />
    <PlayerAvatar style={styles.winner} player={winner} size="big" />

    <FlatList
      style={styles.answers}
      data={answers}
      keyExtractor={(a) => `answer-${a.id}`}
      renderItem={({ item }) => (
        <View style={styles.answer}>
          <Text>{ item.answered_by }</Text>
          <QuestionCard compact question={question} answer={item.answers} />
        </View>
      )}
    />

  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(EndOfTurn);
