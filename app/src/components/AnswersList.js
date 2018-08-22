import * as React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import QuestionCard from './QuestionCard';


const styles = StyleSheet.create({
  item: {
    height: 40,
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
  },
});

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
      <QuestionCard
        style={styles.answer}
        question={question}
        choices={answer.choices}
        textAlign="left"
      />
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
