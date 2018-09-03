import * as React from 'react';
import { StyleSheet, FlatList, View, Text, Image } from 'react-native';


/** ScoreBoard
props:
  - scores
*/

const styles = StyleSheet.create({
  scoreBoard: {},
  boardItem: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingVertical: 5,
    borderColor: '#CCC',
    borderBottomWidth: 1,
  },
  rank: {
    flex: 1,
  },
  nick: {
    flex: 3,
  },
  score: {
    flex: 1,
  },
  cup: {
    flex: 1,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  headerText: {
    color: '#999',
    fontWeight: 'bold',
  },
  cupImage: {
    width: 18,
    height: 18,
  },
});

const cups = [
  require('./cup-1.png'),
  require('./cup-2.png'),
  require('./cup-3.png'),
];

const ScoreBoardHeader = () => (
  <View style={styles.boardItem}>

    <View style={styles.rank}>
      <Text style={[styles.centerText, styles.headerText]}>#</Text>
    </View>

    <View style={styles.nick}>
      <Text style={styles.headerText}>PLAYER</Text>
    </View>

    <View style={styles.score}>
      <Text style={[styles.centerText, styles.headerText]}>SCORE</Text>
    </View>

    <View style={styles.cup}></View>

  </View>
);

const ScoreBoardItem = ({ player, rank }) => (
  <View style={styles.boardItem}>

    <View style={styles.rank}>
      <Text style={styles.centerText}>{ rank }</Text>
    </View>

    <View style={styles.nick}>
      <Text>{ player.nick }</Text>
    </View>

    <View style={styles.score}>
      <Text style={styles.centerText}>{ player.score }</Text>
    </View>

    <View style={styles.cup}>
      { rank <= 3
        ? <Image style={styles.cupImage} source={cups[rank - 1]} />
        : null
      }
    </View>

  </View>
);

const ScoreBoard = ({ scores }) => (
  <View style={styles.scoreBoard}>
    <FlatList
      data={scores}
      keyExtractor={player => player.nick}
      ListHeaderComponent={ScoreBoardHeader}
      renderItem={({ item, index }) => <ScoreBoardItem player={item} rank={index + 1} />}
    />
  </View>
);

export default ScoreBoard;
