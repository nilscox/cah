import * as React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';


const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  question: {

  },
});

const QuestionItem = ({ question, choices, onPress }) => (
  <TouchableOpacity onPress={() => onPress(question)}>
    <QuestionCard styles={styles.question} question={question} choices={choices} />
  </TouchableOpacity>
);

export const QuestionsList = ({ questions, onQuestionPress }) => (
  <View style={styles.view}>
    <FlatList
      data={questions}
      keyExtractor={q => '' + q.id}
      renderItem={({ item }) => (
        <QuestionItem
          choice={item}
          onPress={onQuestionPress}
        />
      )}
    />
  </View>
);