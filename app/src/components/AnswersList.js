import * as React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableWithoutFeedback } from 'react-native';

import { questionLength } from '../services/math-service';
import QuestionCard from './QuestionCard';


/** AnswersList
props:
  - question
  - answers
  - winner
  - onAnswerPress
*/

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  answer: {
    backgroundColor: '#333',
    borderColor: '#666',
    borderBottomWidth: 1,
  },
  answerWinner: {
    borderWidth: 1,
    borderColor: '#6C6',
  },
  answeredBy: {
    textAlign: 'center',
    color: '#EEE',
  },
  answeredByWinner: {
    fontWeight: 'bold',
  },
  answerText: {
    color: '#EEE',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

const Answer = ({ question, answer }) => {
  if (question.type === 'question') {
    return answer.choices.map(c => (
      <Text
        key={c.id}
        style={styles.answerText}
      >
        { c.text }
      </Text>
    ));
  }

  const ql = questionLength(question, answer.choices);
  const questionStyles = {
    height: ql > 160 ? 100 : 75,
  };

  const questionCssStyles = {
    textAlign: 'left',
    fontSize: ql < 60 ? 16 : 14,
    lineHeight: ql < 60 ? 18 : 16,
  };

  return (
    <QuestionCard
      style={questionStyles}
      question={question}
      choices={answer.choices}
      cssStyles={questionCssStyles}
    />
  );
};

const AnswerItem = ({ question, answer, isWinner, onPress }) => (
  <TouchableWithoutFeedback onPress={() => onPress(answer)}>
    <View style={[styles.answer, isWinner && styles.answerWinner]}>

      <Text style={[styles.answeredBy, isWinner && styles.answeredByWinner]}>
        { answer.answeredBy || ' ' }
      </Text>

      <Answer question={question} answer={answer} />

    </View>
  </TouchableWithoutFeedback>
);

const AnswersList = ({ question, answers, winner, onAnswerPress }) => (
  <View style={styles.view}>
    <FlatList
      data={answers}
      keyExtractor={a => '' + a.id}
      renderItem={({ item }) => (
        <AnswerItem
          question={item.question || question}
          answer={item}
          isWinner={winner && winner === item.answeredBy}
          onPress={onAnswerPress}
        />
      )}
    />
  </View>
);

export default AnswersList;
