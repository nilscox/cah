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
    lineHeight: 30,
  },
  question_text: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  question_blanks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
  },
  blank: {
    width: 40,
    marginHorizontal: 5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
