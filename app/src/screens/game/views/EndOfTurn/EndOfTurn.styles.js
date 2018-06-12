import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  turnNumber: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: '#999',
  },
  winner: {
    marginVertical: 35,
  },
  crown: {
    position: 'absolute',
    width: 60,
    height: 30,
    transform: [
      { translateX: -25 },
      { translateY: 10 },
      { rotateZ: '-30deg' },
    ],
  },
  answers: {
    flex: 1,
    alignSelf: 'stretch',
  },
  answer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    backgroundColor: '#333',
  },
  winnerAnswer: {
    borderWidth: 1,
    borderColor: '#393',
    borderBottomColor: '#393',
  },
  answeredBy: {
    color: '#eee',
    fontWeight: 'bold',
    fontSize: 14,
  },
  answeredByAvatar: {
    position: 'absolute',
    end: 15,
    top: 5,
  },
});
