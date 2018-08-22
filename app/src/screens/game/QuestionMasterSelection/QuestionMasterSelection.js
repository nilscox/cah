import * as React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';

import { selectAnswer } from '../../../services/game-service';

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

export default class QuestionMasterSelection extends React.Component {

  state = {
    selected: false,
  };

  async selectAnswer(answer) {
    const { game } = this.props;
    const { res, json } = await selectAnswer(game.id, answer);

    if (res.status === 200)
      this.setState({ selected: true });
    else
      console.log(json);
  }

  render() {
    const { player, game } = this.props;
    const { selected } = this.state;

    const canSelect = !selected && game.questionMaster === player.nick;

    return (
      <View style={styles.view}>
        <FlatList
          data={game.propositions}
          keyExtractor={p => '' + p.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => canSelect && this.selectAnswer(item)}>
              <QuestionCard
                style={styles.question}
                question={game.question}
                choices={item.choices}
                textAlign="left"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

}
