// @flow

import * as React from 'react';
import { View, Image, Text } from 'react-native';
import { connect } from 'react-redux';

import type { Player } from '~/redux/state/player';
import type { Question } from '~/redux/state/question';
import type { AnsweredQuestion } from '~/redux/state/answeredQuestion';
import { nextTurn } from '~/redux/actions';
import selectors from '~/redux/selectors';
import PlayerAvatar from '~/components/PlayerAvatar';
import AnsweredQuestionsList from '~/components/AnsweredQuestionsList';

import GoNextButton from './GoNextButton';
import styles from './EndOfTurn.styles';

type EndOfTurnProps = {
  number: number,
  winner: Player,
  question: Question,
  answers: Array<AnsweredQuestion>,
  isWinner: (string) => boolean,
  getPlayer: (string) => boolean,
  canGoNext: boolean,
  nextTurn: Function,
};

const mapStateToProps = (state) => {
  const turn = selectors.gameLastTurn(state);
  const winner = selectors.gameLastTurnWinner(state);

  return {
    number: turn.number,
    winner: winner,
    question: turn.question,
    answers: turn.answers,
    isWinner: (nick) => nick === winner.nick,
    getPlayer: selectors.gamePlayer(state),
    canGoNext: selectors.gameIsQuestionMaster(state),
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  nextTurn: () => dispatch(nextTurn()),
});

const EndOfTurn = ({
  number,
  winner,
  question,
  answers,
  isWinner,
  getPlayer,
  canGoNext,
  nextTurn,
}: EndOfTurnProps) => (
  <View style={styles.wrapper}>

    <Text style={styles.turnNumber}>#{ number }</Text>

    <Image style={styles.crown} source={require('./crown.png')} />
    <PlayerAvatar style={styles.winner} player={winner} size="big" />

    { canGoNext && <GoNextButton winner={winner.nick} nextTurn={nextTurn} /> }

    <AnsweredQuestionsList
      answers={answers.map(a => ({...a, question}))}
      isWinner={isWinner}
      getPlayer={getPlayer}
    />

  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(EndOfTurn);
