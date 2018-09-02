import * as React from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import ChoiceCard from './ChoiceCard';


const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: '#CCC',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  selected: {
    fontWeight: 'bold',
  },
});

const ChoiceItem = ({ choice, onPress }) => (
  <View style={styles.item}>
    <TouchableOpacity onPress={() => onPress(choice)}>
      <ChoiceCard style={[choice.selected && styles.selected]} choice={choice} />
    </TouchableOpacity>
  </View>
);

export default ChoicesList = ({ style, choices, selection, onChoicePress }) => (
  <View style={[styles.view, style]}>
    <FlatList
      data={choices.map(c => ({ ...c, selected: !!selection.find(s => s && s.id === c.id) }))}
      keyExtractor={c => '' + c.id}
      renderItem={({ item }) => (
        <ChoiceItem
          choice={item}
          onPress={onChoicePress}
        />
      )}
    />
  </View>
);
