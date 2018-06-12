// @flow

import * as React from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { Player } from '~/redux/state/player';
import type { Question } from '~/redux/state/question';
import type { AnsweredQuestion } from '~/redux/state/answeredQuestion';
import { nextTurn } from '~/redux/actions/game';
import PlayerAvatar from '~/components/PlayerAvatar';
import AnsweredQuestionCard from '~/components/AnsweredQuestionCard';

import GoNextButton from './GoNextButton';
import styles from './EndOfTurn.styles';

type EndOfTurnProps = {
  number: number,
  winner: Player,
  question: Question,
  answers: Array<AnsweredQuestion>,
  isWinner: (string) => boolean,
  canGoNext: boolean,
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
    isWinner: (player) => player === winner.nick,
    canGoNext: player.nick === game.question_master,
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
  isWinner,
  canGoNext,
  nextTurn,
}: EndOfTurnProps) => (
  <View style={styles.wrapper}>

    <Text style={styles.turnNumber}>#{ number }</Text>

    <Image style={styles.crown} source={require('./crown.png')} />
    <PlayerAvatar style={styles.winner} player={winner} size="big" />

    { canGoNext && <GoNextButton winner={winner.nick} nextTurn={nextTurn} /> }

    <FlatList
      style={styles.answers}
      data={answers}
      keyExtractor={(a) => `answer-${a.id}`}
      renderItem={({ item }) => (
        <View style={[styles.answer, isWinner(item.answered_by) && styles.winnerAnswer]}>
          <Text style={styles.answeredBy}>{ item.answered_by }</Text>
          <AnsweredQuestionCard size="tiny" question={question} answer={item.answers} />
        </View>
      )}
    />

  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(EndOfTurn);
