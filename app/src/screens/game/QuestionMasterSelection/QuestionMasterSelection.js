import * as React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Redirect } from 'react-router-native';

import QuestionCard from '../../../components/QuestionCard';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  question: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#999',
    borderBottomWidth: 1,
  },
});

export default QuestionMasterSelection = ({ game }) => (
  <View style={styles.view}>
    <FlatList
      data={game.propositions}
      keyExtractor={p => '' + p.id}
      renderItem={({ item }) => (
        <QuestionCard
          style={styles.question}
          question={game.question}
          choices={item.choices}
          textAlign="left"
        />
      )}
    />
  </View>
);
