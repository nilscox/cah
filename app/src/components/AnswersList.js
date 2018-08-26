import * as React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import { questionLength } from '../services/math-service';
import QuestionCard from './QuestionCard';


const answerCssStyles = (question, choices) => {
  const fontSize = len => {
    if (len < 45) return 18;
    else if (len < 120) return 14;
    else return 12;
  }

  const lineHeight = len => {
    if (len < 45) return 16;
    else if (len < 120) return 16;
    else return 10;
  }

  const len = questionLength(question, choices);

  return {
    textAlign: 'left',
    fontSize: fontSize(len),
    lineHeight: lineHeight(len),
  };
};

const styles = StyleSheet.create({
  item: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answeredBy: {
    width: 80,
    textAlign: 'center',
  },
  answeredByWinner: {
    fontWeight: 'bold',
  },
  answer: {
    flex: 1,
    paddingHorizontal: 10,
    borderColor: '#999',
    borderBottomWidth: 1,
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  answerText: {
    color: '#EEE',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});

const Answer = ({ question, answer }) => {
  if (question.type === 'question') {
    return (
      <View style={styles.answer}>
        { answer.choices.map(c => (
          <Text
            key={c.id}
            style={styles.answerText}
          >
            { c.text }
          </Text>
        )) }
      </View>
    );
  }

  return (
    <QuestionCard
      style={styles.answer}
      question={question}
      choices={answer.choices}
      cssStyles={answerCssStyles(question, answer.choices)}
    />
  );
}

const AnswerItem = ({ question, answer, isWinner, onPress }) => (
  <View style={styles.item}>

    { answer.answeredBy && (
      <Text
        style={[styles.answeredBy, isWinner && styles.answeredByWinner]}
      >
        { answer.answeredBy }
      </Text>
    )}

    <TouchableOpacity style={{ flex: 1 }} onPress={() => onPress(answer)}>
      <Answer question={question} answer={answer} />
    </TouchableOpacity>
  </View>
);

export default AnswersList = ({ style, question, answers, winner, onAnswerPress }) => (
  <View style={style}>
    <FlatList
      data={answers}
      keyExtractor={c => '' + c.id}
      renderItem={({ item }) => (
        <AnswerItem
          question={question}
          answer={item}
          isWinner={winner === item.answeredBy}
          onPress={onAnswerPress}
        />
      )}
    />
  </View>
);
