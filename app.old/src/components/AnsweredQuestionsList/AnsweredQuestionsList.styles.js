import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  answers: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#444',
  },
  answer: {
    paddingHorizontal: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#666',
    backgroundColor: '#333',
  },
  winnerAnswer: {
    borderWidth: 1,
    borderColor: '#393',
  },
  answeredBy: {
    paddingTop: 10,
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