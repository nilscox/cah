import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';


export default QuestionMasterSelection = ({ game }) => (
  <View>
    <Text>Game #{game.id} started (question master selection)</Text>
  </View>
);
