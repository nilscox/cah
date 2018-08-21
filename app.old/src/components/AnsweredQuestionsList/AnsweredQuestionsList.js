// @flow

import * as React from 'react';
import { View, Text, FlatList } from 'react-native';

import type { Player } from '~/redux/state/player';
import type { AnsweredQuestion, FullAnsweredQuestion } from '~/redux/state/answeredQuestion';
import AnsweredQuestionCard from '~/components/AnsweredQuestionCard';
import PlayerAvatar from '~/components/PlayerAvatar';

import styles from './AnsweredQuestionsList.styles.js';

type AnsweredQuestionsListProps = {
  answers: Array<AnsweredQuestion> | Array<FullAnsweredQuestion>,
  isWinner?: (?string) => boolean,
  getPlayer?: (string) => Player,
};

const AnsweredQuestionsList = ({ answers, isWinner, getPlayer }: AnsweredQuestionsListProps) => (
  <FlatList
    style={styles.answers}
    data={answers}
    keyExtractor={(a) => `answer-${a.id}`}
    renderItem={({ item }) => (
      <View style={[styles.answer, isWinner(item.answered_by) && styles.winnerAnswer]}>

        { item.answered_by && (
          <Text style={styles.answeredBy}>
            { item.answered_by }
          </Text>
        ) }

        <AnsweredQuestionCard size="tiny" question={item.question} answer={item.answers} />

        { getPlayer && item.answered_by && (
          <PlayerAvatar
            style={styles.answeredByAvatar}
            player={getPlayer(item.answered_by)}
            size="small"
            showNick={false}
          />
        ) }

      </View>
    )}
  />
);

AnsweredQuestionsList.defaultProps = {
  isWinner: () => false,
  getPlayer: null,
};

export default AnsweredQuestionsList;
