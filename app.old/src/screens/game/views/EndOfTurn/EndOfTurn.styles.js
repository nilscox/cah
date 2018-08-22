import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#eee',
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
});