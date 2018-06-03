import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 40,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    lineHeight: 25,
  },
  question_blanks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
  },
  blank: {
    width: 40,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
